import 'package:flutter/material.dart';
import 'package:foodbridge-volunteers/view/login/login_view.dart';
import 'package:foodbridge-volunteers/view/login/sign_up_view.dart';

import '../../common/color_extension.dart';
import '../../common_widget/round_button.dart';

class WelcomeView extends StatefulWidget {
  const WelcomeView({super.key});

  @override
  State<WelcomeView> createState() => _WelcomeViewState();
}

class _WelcomeViewState extends State<WelcomeView>
    with TickerProviderStateMixin {
  late AnimationController _controllerWelcome;
  late AnimationController _controller1;
  late AnimationController _controllerText;

  @override
  void initState() {
    super.initState();

    // Initialize animation controllers for each element
    _controllerWelcome = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _controller1 = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _controllerText = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    // Delay to trigger the animation sequence
    Future.delayed(const Duration(milliseconds: 200), () {
      _animateElements(); // Trigger animations sequentially after 200ms delay
    });
  }

  void _animateElements() async {
    await _controllerWelcome.forward(); // Animate welcome_top_shape.png
    await Future.delayed(const Duration(milliseconds: 200)); // Small delay
    await _controller1.forward(); // Animate 1.png
    await Future.delayed(const Duration(milliseconds: 200)); // Small delay
    _controllerText.forward(); // Animate text and buttons
  }

  @override
  void dispose() {
    // Dispose the controllers to avoid memory leaks
    _controllerWelcome.dispose();
    _controller1.dispose();
    _controllerText.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var media = MediaQuery.of(context).size;

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.start, // Align the children from the top
          children: [
            // Image at the top
            Container(
              width: media.width,
              child: Stack(
                alignment: Alignment.bottomCenter,
                children: [
                  FadeTransition(
                    opacity: _controllerWelcome,
                    child: Image.asset(
                      "assets/img/welcome_top_shape.png",
                      width: media.width,
                      fit: BoxFit.fill, // Ensure image fills the width
                    ),
                  ),
                  Positioned(
                    bottom: 20, // Add space at the bottom to make it visible
                    child: FadeTransition(
                      opacity: _controller1,
                      child: Image.asset(
                        "assets/img/1.png",
                        width: media.width * 0.4,
                        height: media.width * 0.4,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            FadeTransition(
              opacity: _controllerText,
              child: Column(
                children: [
                  Text(
                    "Your Time, Their Meal: \nTogether We Make a Difference.",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: TColor.secondaryText,
                        fontSize: 13,
                        fontWeight: FontWeight.w700),
                  ),
                  SizedBox(
                    height: media.width * 0.1,
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25),
                    child: RoundButton(
                      title: "Login",
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginView(),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25),
                    child: RoundButton(
                      title: "Create an Account",
                      type: RoundButtonType.textPrimary,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const SignUpView(),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
