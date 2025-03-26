import 'package:flutter/material.dart';
import 'package:foodbridge-volunteers/common/color_extension.dart';
import 'package:foodbridge-volunteers/common_widget/round_button.dart';
import 'package:foodbridge-volunteers/view/main_tabview/main_tabview.dart';

class OnBoardingView extends StatefulWidget {
  const OnBoardingView({super.key});

  @override
  State<OnBoardingView> createState() => _OnBoardingViewState();
}

class _OnBoardingViewState extends State<OnBoardingView> {
  int selectPage = 0;
  PageController controller = PageController();

  List pageArr = [
    {
      "title": "Meals of Hope",
      "subtitle": "Bringing Food to Those Who Need It Most.",
      "image": "assets/img/on_boarding_1.png",
    },
    {
      "title": "Timely Touch",
      "subtitle": "Ensuring Every Meal Arrives Right on Time.",
      "image": "assets/img/on_boarding_2.png",
    },
    {
      "title": "Food Pathway",
      "subtitle": "Real-Time Tracking for Smarter Deliveries.",
      "image": "assets/img/on_boarding_3.png",
    },
  ];

  @override
  void initState() {
    super.initState();
    controller.addListener(() {
      // Prevent unnecessary rebuilds
      int currentPage = controller.page?.round() ?? 0;
      if (currentPage != selectPage) {
        setState(() {
          selectPage = currentPage;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    var media = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        alignment: Alignment.center,
        children: [
          PageView.builder(
            controller: controller,
            itemCount: pageArr.length,
            itemBuilder: ((context, index) {
              var pObj = pageArr[index] as Map? ?? {};
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: media.width,
                    height: media.width,
                    alignment: Alignment.center,
                    child: Image.asset(
                      pObj["image"].toString(),
                      width: media.width * 0.65,
                      fit: BoxFit.contain,
                    ),
                  ),
                  SizedBox(
                    height: media.width * 0.2,
                  ),
                  Text(
                    pObj["title"].toString(),
                    style: TextStyle(
                        color: TColor.primaryText,
                        fontSize: 28,
                        fontWeight: FontWeight.w800),
                  ),
                  SizedBox(
                    height: media.width * 0.05,
                  ),
                  Text(
                    pObj["subtitle"].toString(),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: TColor.secondaryText,
                        fontSize: 13,
                        fontWeight: FontWeight.w500),
                  ),
                  SizedBox(
                    height: media.width * 0.20,
                  ),
                ],
              );
            }),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(
                height: media.height * 0.6,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: pageArr.map((e) {
                  var index = pageArr.indexOf(e);
                  return AnimatedContainer(
                    duration: Duration(milliseconds: 200),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    height: 6,
                    width: 6,
                    decoration: BoxDecoration(
                        color: index == selectPage
                            ? TColor.primary
                            : TColor.placeholder,
                        borderRadius: BorderRadius.circular(4)),
                  );
                }).toList(),
              ),
              SizedBox(
                height: media.height * 0.28,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: RoundButton(
                    title: "Next",
                    onPressed: () {
                      if (selectPage >= 2) {
                        // Go to Home Screen or MainTabView
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const MainTabView(),
                          ),
                        );
                      } else {
                        setState(() {
                          selectPage = selectPage + 1;
                          controller.animateToPage(selectPage,
                              duration: const Duration(milliseconds: 500),
                              curve: Curves.easeInOut);
                        });
                      }
                    }),
              ),
            ],
          )
        ],
      ),
    );
  }
}
