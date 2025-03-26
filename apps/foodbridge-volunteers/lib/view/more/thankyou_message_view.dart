import 'package:flutter/material.dart';
import 'package:foodbridge-volunteers/common_widget/round_button.dart';
import 'package:foodbridge-volunteers/view/home/home_view.dart';
import '../../common/color_extension.dart';

class CheckoutMessageView extends StatefulWidget {
  const CheckoutMessageView({super.key});

  @override
  State<CheckoutMessageView> createState() => _CheckoutMessageViewState();
}

class _CheckoutMessageViewState extends State<CheckoutMessageView> {
  @override
  Widget build(BuildContext context) {
    var media = MediaQuery.sizeOf(context);

    return Material(
      color: TColor
          .white, // Material widget to avoid the "No Material widget found" error
      child: SafeArea(
        // Wrap with SafeArea to prevent overflow
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 25),
          width: media.width,
          decoration: BoxDecoration(
              color: TColor.white,
              borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20), topRight: Radius.circular(20))),
          child: Column(
            mainAxisAlignment: MainAxisAlignment
                .center, // Centered alignment to avoid overflow
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    icon: Icon(
                      Icons.close,
                      color: TColor.primaryText,
                      size: 25,
                    ),
                  )
                ],
              ),
              Image.asset(
                "assets/img/thank_you.png",
                width: media.width * 0.55,
              ),
              const SizedBox(
                height: 25,
              ),
              Text(
                "Thank You!",
                style: TextStyle(
                    color: TColor.primaryText,
                    fontSize: 26,
                    fontWeight: FontWeight.w700),
              ),
              const SizedBox(
                height: 8,
              ),
              const SizedBox(
                height: 25,
              ),
              Text(
                "Thanks for your service!",
                textAlign: TextAlign.center,
                style: TextStyle(color: TColor.primaryText, fontSize: 14),
              ),
              const SizedBox(
                height: 35,
              ),
              RoundButton(
                  title: "Go To Home",
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const HomeView(),
                      ),
                    );
                  }),
              const SizedBox(
                height: 8,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
