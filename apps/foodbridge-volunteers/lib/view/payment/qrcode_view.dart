import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class PaymentQRCodeScreen extends StatelessWidget {
  final String upiLink = "upi://pay?pa=deliveryguy@upi&pn=Delivery%20Guy&am=100&cu=INR"; 
  // Replace with actual UPI ID and amount dynamically

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Scan to Pay')),
      body: Center(
        child: QrImageView(
          data: upiLink, // The UPI payment URL
          version: QrVersions.auto,
          size: 200.0,
        ),
      ),
    );
  }
}
