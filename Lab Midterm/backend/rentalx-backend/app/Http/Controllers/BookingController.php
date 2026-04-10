<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }
    }

    private function ensureEmployee(Request $request)
    {
        if (!$request->user() || !$request->user()->isEmployee()) {
            abort(403, 'Employee access required.');
        }
    }

    private function sendBookingNotification($email, $name, $subject, $messageBody)
    {
        try {
            Mail::send([], [], function ($message) use ($email, $name, $subject, $messageBody) {
                $message->from(config('mail.from.address'), config('mail.from.name'))
                    ->to($email, $name)
                    ->subject($subject)
                    ->setBody($messageBody, 'text/plain');
            });
        } catch (\Exception $e) {
            logger()->warning('Booking notification email could not be sent: ' . $e->getMessage());
        }
    }

    public function index(Request $request)
    {
        if ($request->user()->isAdmin()) {
            return Booking::with(['car', 'employee', 'user'])->get();
        }

        if ($request->user()->isEmployee()) {
            return Booking::with(['car', 'employee', 'user'])->where('employee_id', $request->user()->id)->get();
        }

        return $request->user()->bookings()->with(['car', 'employee'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:pickup_date',
            'pickup_location' => 'required|string',
            'dropoff_location' => 'required|string',
            'fullname' => 'required|string',
            'phone' => 'required|string',
            'license' => 'required|string',
            'emergency' => 'required|string',
        ]);

        $data['confirmation_token'] = Str::random(48);
        $data['confirmed_at'] = null;
        $booking = $request->user()->bookings()->create($data);
        $booking->load('car');

        try {
            $pickup = new \DateTime($data['pickup_date']);
            $return = new \DateTime($data['return_date']);
            $days = max(1, (int) ceil(($return->getTimestamp() - $pickup->getTimestamp()) / 86400));
            $total = $booking->car->daily_rate * $days;
            $confirmUrl = url('/api/bookings/confirm/' . $booking->confirmation_token);

            Mail::send([], [], function ($message) use ($request, $booking, $total, $confirmUrl) {
                $message->from(config('mail.from.address'), config('mail.from.name'))
                    ->to($request->user()->email, $request->user()->name)
                    ->subject('RentalX Booking Confirmation')
                    ->setBody(
                        "Hello {$request->user()->name},\n\n" .
                        "Your RentalX booking request is almost complete. Please confirm your reservation by clicking the link below:\n\n" .
                        "{$confirmUrl}\n\n" .
                        "Booking Details:\n" .
                        "Booking ID: {$booking->id}\n" .
                        "Car: {$booking->car->name}\n" .
                        "Pickup Date: {$booking->pickup_date}\n" .
                        "Return Date: {$booking->return_date}\n" .
                        "Pickup Location: {$booking->pickup_location}\n" .
                        "Drop-off Location: {$booking->dropoff_location}\n" .
                        "Total Price: ₹{$total}\n\n" .
                        "After confirmation, your booking will be active. If you did not make this request, please ignore this email.\n\n" .
                        "Thank you for choosing RentalX,\nThe RentalX Team",
                        'text/plain'
                    );
            });
        } catch (\Exception $e) {
            logger()->warning('Booking confirmation email could not be sent: ' . $e->getMessage());
        }

        return response()->json([
            'booking' => $booking,
            'message' => 'Booking created. A confirmation email has been sent to your inbox.',
            'status' => 'pending_confirmation'
        ], 201);
    }

    public function confirm($token)
    {
        $booking = Booking::where('confirmation_token', $token)->first();

        if (!$booking) {
            return response()->json(['message' => 'Confirmation link is invalid or expired.'], 404);
        }

        if ($booking->confirmed_at) {
            return response()->json(['message' => 'This booking has already been confirmed.'], 200);
        }

        $booking->confirmed_at = now();
        $booking->status = 'pending';
        $booking->save();

        return response()->json(['message' => 'Your booking has been confirmed successfully.', 'booking' => $booking], 200);
    }

    public function adminAccept(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $booking = Booking::findOrFail($id);
        $booking->status = 'accepted';
        $booking->save();

        $this->sendBookingNotification(
            $booking->user->email,
            $booking->user->name,
            'RentalX Booking Accepted',
            "Hello {$booking->user->name},\n\nYour booking #{$booking->id} has been accepted by RentalX.\nPickup Location: {$booking->pickup_location}\nReturn Location: {$booking->dropoff_location}\nReturn Date: {$booking->return_date}\n\nPlease wait for the assigned employee to reach out to you.\n\nThank you,\nRentalX Team"
        );

        return response()->json(['message' => 'Booking accepted.', 'booking' => $booking], 200);
    }

    public function adminReject(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $booking = Booking::findOrFail($id);
        $booking->status = 'rejected';
        $booking->save();

        $this->sendBookingNotification(
            $booking->user->email,
            $booking->user->name,
            'RentalX Booking Rejected',
            "Hello {$booking->user->name},\n\nYour booking #{$booking->id} has been rejected. Please contact support for more details.\n\nThank you,\nRentalX Team"
        );

        return response()->json(['message' => 'Booking rejected.', 'booking' => $booking], 200);
    }

    public function adminAssignEmployee(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $request->validate([
            'employee_id' => 'required|exists:users,id',
        ]);

        $employee = User::findOrFail($request->input('employee_id'));
        if (!$employee->isEmployee()) {
            return response()->json(['message' => 'Selected user is not an employee.'], 422);
        }

        $booking = Booking::findOrFail($id);
        $booking->employee_id = $employee->id;
        $booking->status = 'assigned';
        $booking->save();

        $this->sendBookingNotification(
            $booking->user->email,
            $booking->user->name,
            'RentalX Booking Assigned',
            "Hello {$booking->user->name},\n\nYour booking #{$booking->id} has been assigned to {$employee->name}. They will manage pickup and return.\n\nThank you,\nRentalX Team"
        );

        return response()->json(['message' => 'Employee assigned to booking.', 'booking' => $booking], 200);
    }

    public function adminUpdate(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $booking = Booking::findOrFail($id);
        $data = $request->validate([
            'pickup_date' => 'sometimes|date',
            'return_date' => 'sometimes|date|after_or_equal:pickup_date',
            'pickup_location' => 'sometimes|string',
            'dropoff_location' => 'sometimes|string',
        ]);

        $booking->update($data);

        return response()->json(['message' => 'Booking updated.', 'booking' => $booking], 200);
    }

    public function adminDelete(Request $request, $id)
    {
        $this->ensureAdmin($request);

        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted.'], 200);
    }

    public function employeePickup(Request $request, $id)
    {
        $this->ensureEmployee($request);

        $booking = Booking::where('employee_id', $request->user()->id)->findOrFail($id);
        $booking->status = 'active';
        $booking->pickup_time = now();
        $booking->save();

        return response()->json(['message' => 'Booking marked as picked up.', 'booking' => $booking], 200);
    }

    public function employeeReturn(Request $request, $id)
    {
        $this->ensureEmployee($request);

        $booking = Booking::where('employee_id', $request->user()->id)->findOrFail($id);
        $booking->returned_at = now();

        $lateFee = 0;
        $returnDeadline = new \DateTime($booking->return_date . ' 23:59:59');
        $returnedAt = new \DateTime($booking->returned_at);
        if ($returnedAt > $returnDeadline) {
            $interval = $returnDeadline->diff($returnedAt);
            $daysLate = max(1, $interval->days);
            $lateFee = $daysLate * 500; // fixed late fee per day
        }

        $booking->late_fee = $lateFee;
        $booking->status = 'returned';
        $booking->save();

        $message = "Hello {$booking->user->name},\n\nYour booking #{$booking->id} has been returned successfully.";
        if ($lateFee > 0) {
            $message .= "\nA late return fine of ₹{$lateFee} has been applied. Please settle this with the employee at pickup/return time.";
        }
        $message .= "\n\nThank you for choosing RentalX,\nRentalX Team";

        $this->sendBookingNotification($booking->user->email, $booking->user->name, 'RentalX Booking Returned', $message);

        return response()->json(['message' => 'Booking marked returned.', 'booking' => $booking], 200);
    }
}
