import 'package:flutter/material.dart';
import 'package:foodbridge-volunteers/common/color_extension.dart';
import 'package:foodbridge-volunteers/view/login/welcome_view.dart';

class StartupView extends StatefulWidget {
  const StartupView({super.key});

  @override
  State<StartupView> createState() => _StarupViewState();
}

class _StarupViewState extends State<StartupView>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    // Initialize the animation controller
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    // Define the fade animation
    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );

    // Start the delay and transition
    goWelcomePage();
  }

  void goWelcomePage() async {
    await Future.delayed(const Duration(seconds: 3));
    _animationController.forward(); // Start the fade-out animation
    Future.delayed(const Duration(milliseconds: 800), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const WelcomeView()),
      );
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var media = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        alignment: Alignment.center,
        children: [
          // Background and logo of the splash screen
          FadeTransition(
            opacity: ReverseAnimation(_fadeAnimation),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Image.asset(
                  "assets/img/splash_bg.png",
                  width: media.width,
                  height: media.height,
                  fit: BoxFit.cover,
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      "assets/img/1.png",
                      width: media.width * 0.55,
                      height: media.width * 0.55,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(height: 20),
                    Text(
                      "FoodBridge",
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: TColor.primary,
                        fontFamily: 'Lobster',
                        shadows: [
                          Shadow(
                            offset: Offset(2, 2),
                            blurRadius: 4,
                            color: Colors.black45,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Fade-in WelcomeView
          FadeTransition(
            opacity: _fadeAnimation,
            child: Container(
              color: Colors.white, // Prevents a flash of transparency
            ),
          ),
        ],
      ),
    );
  }
}
