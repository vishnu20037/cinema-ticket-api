# cinema-ticket-api
Creating a cinema:

URL: POST http://localhost:3000/cinemas
Request body: { "seats": 100 }
Purchasing a specific seat:

URL: POST http://localhost:3000/cinemas/{cinemaId}/purchase/{seatNumber}
Replace {cinemaId} with the cinema ID obtained from the previous step.
Replace {seatNumber} with the desired seat number.
Purchasing the first two free consecutive seats:

URL: POST http://localhost:3000/cinemas/{cinemaId}/purchaseConsecutive
Replace {cinemaId} with the cinema ID obtained from the first step.
