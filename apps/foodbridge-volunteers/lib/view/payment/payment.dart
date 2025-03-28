import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:foodbridge-volunteers/view/more/thankyou_message_view.dart';
import 'package:foodbridge-volunteers/view/payment/keys.dart';
import 'package:http/http.dart' as http;
import 'package:foodbridge-volunteers/common/color_extension.dart';

class Payment extends StatefulWidget {
  final double amount;

  const Payment({super.key, required this.amount});

  @override
  State<Payment> createState() => _PaymentState();
}

class _PaymentState extends State<Payment> {
  late double amount;

  @override
  void initState() {
    super.initState();
    amount = widget.amount; // Initialize amount inside initState
  }

  Map<String, dynamic>? intentPaymentData; // Fixed null issue

  showPaymentSheet() async {
    try {
      await Stripe.instance.presentPaymentSheet();
      intentPaymentData = null;
      // Navigate to CheckoutMessageView on successful payment
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const CheckoutMessageView(),
        ),
      );
    } on StripeException catch (error) {
      if (kDebugMode) {
        print(error);
      }
      showDialog(
          context: context,
          builder: (c) => const AlertDialog(
                content: Text("Cancelled"),
              ));
    } catch (errorMsg, s) {
      if (kDebugMode) {
        print("$errorMsg $s");
      }
    }
  }

  Future<Map<String, dynamic>?> makeIntentForPayment(
      String amountToBeCharge, String currency) async {
    try {
      final agentAccountId = "acct_1QuB8p4GpznroXAN"; // Agent account

      Map<String, dynamic> paymentInfo = {
        "amount": (double.parse(amountToBeCharge) * 100).toInt().toString(),
        "currency": currency,
        "payment_method_types[]": "card",
        // Split the payment: 20% to developer, remaining to agent
        "transfer_data[destination]":
            agentAccountId, // The agent's account to receive the majority
        "application_fee_amount": (0.20 * double.parse(amountToBeCharge) * 100)
            .toInt()
            .toString(), // 20% fee to the developer's account
      };

      var responseFromStripeAPI = await http.post(
          Uri.parse("https://api.stripe.com/v1/payment_intents"),
          body: paymentInfo,
          headers: {
            "Authorization": "Bearer $SecretKey",
            "Content-Type": "application/x-www-form-urlencoded"
          });

      if (responseFromStripeAPI.statusCode == 200) {
        return jsonDecode(responseFromStripeAPI.body);
      } else {
        throw Exception("Stripe API error: ${responseFromStripeAPI.body}");
      }
    } catch (errorMsg) {
      if (kDebugMode) {
        print(errorMsg);
      }
      return null;
    }
  }

  paymentSheetInitialization(String amountToBeCharge, String currency) async {
    try {
      intentPaymentData =
          await makeIntentForPayment(amountToBeCharge, currency);

      if (intentPaymentData == null ||
          !intentPaymentData!.containsKey("client_secret")) {
        throw Exception("Failed to get client secret");
      }

      await Stripe.instance.initPaymentSheet(
          paymentSheetParameters: SetupPaymentSheetParameters(
              allowsDelayedPaymentMethods: true,
              paymentIntentClientSecret: intentPaymentData!["client_secret"],
              style: ThemeMode.dark,
              merchantDisplayName: "Company Name Example"));

      showPaymentSheet();
    } catch (errorMsg, s) {
      if (kDebugMode) {
        print("$errorMsg $s");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(
                height: 46,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 15),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: Image.asset("assets/img/btn_back.png",
                          width: 20, height: 20),
                    ),
                    const SizedBox(
                      width: 8,
                    ),
                    Expanded(
                      child: Text(
                        "Scan to Pay",
                        style: TextStyle(
                            color: TColor.primaryText,
                            fontSize: 20,
                            fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ),
              ),
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        paymentSheetInitialization(
                            amount.round().toString(), "USD");
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                      ),
                      child: Text("Pay Now \$${amount.toString()}",
                          style: const TextStyle(
                            color: Colors.white,
                          )),
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
