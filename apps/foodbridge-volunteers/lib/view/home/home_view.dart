import 'package:flutter/material.dart';
import 'package:foodbridge-volunteers/common/color_extension.dart';
import 'package:foodbridge-volunteers/common_widget/round_textfield.dart';
import 'package:foodbridge-volunteers/view/maps/current_location_view.dart';
import 'package:foodbridge-volunteers/view/menu/item_details_view.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import '../../common_widget/recent_item_row.dart';
import '../../common_widget/view_all_title_row.dart';
import 'package:foodbridge-volunteers/data/recent_data.dart';

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  TextEditingController txtSearch = TextEditingController();
  bool _isDropdownOpen = false;
  String? _actualLocation;
  bool _showAll = false;
  String _greetingMessage = "Good morning";

  List<Map> filteredArr =
      []; // To store the filtered list based on the search query

  @override
  void initState() {
    super.initState();
    filteredArr = List.from(recentArr); // Initially, show all items
    _determinePosition();
    _setGreetingMessage();
  }

  void _setGreetingMessage() {
    final hour = DateTime.now().hour;

    if (hour >= 5 && hour < 12) {
      _greetingMessage = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      _greetingMessage = "Good afternoon";
    } else {
      _greetingMessage = "Good evening";
    }

    setState(() {
      _greetingMessage = _greetingMessage;
    });
  }

  void _filterSearchResults(String query) {
    List<Map> results = [];
    if (query.isEmpty) {
      results = List.from(recentArr); // Show all items if the search is empty
    } else {
      results = recentArr.where((item) {
        var foodName = item["food_name"].toString().toLowerCase();
        var searchTerm = query.toLowerCase();
        return foodName.contains(searchTerm); // Search by food name
      }).toList();
    }
    setState(() {
      filteredArr = results; // Update the filtered list
    });
  }

  Future<void> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Location Permission Required"),
          content:
              const Text("Please enable location permissions in settings."),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("OK"),
            ),
          ],
        ),
      );
      return;
    }

    Position position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    try {
      List<Placemark> placemarks =
          await placemarkFromCoordinates(position.latitude, position.longitude);

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks.first;
        setState(() {
          _actualLocation =
              "${place.name}, ${place.locality}, ${place.administrativeArea}";
        });
      }
    } catch (e) {
      print("Error getting address: $e");
      setState(() {
        _actualLocation = "Location not available";
      });
    }
  }

  void _toggleDropdown() {
    setState(() {
      _isDropdownOpen = !_isDropdownOpen;
    });
  }

  void _navigateToCurrentLocationView() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const CurrentLocationView(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            children: [
              const SizedBox(height: 46),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "$_greetingMessage Jeevesh",
                      style: TextStyle(
                          color: TColor.primaryText,
                          fontSize: 20,
                          fontWeight: FontWeight.w800),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Location Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    GestureDetector(
                      onTap: _toggleDropdown,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Text(
                            "Current Location",
                            style: TextStyle(
                                color: TColor.secondaryText,
                                fontSize: 11,
                                fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(width: 10),
                          Icon(
                            _isDropdownOpen
                                ? Icons.arrow_drop_up
                                : Icons.arrow_drop_down,
                            color: TColor.secondaryText,
                          ),
                        ],
                      ),
                    ),
                    if (_isDropdownOpen)
                      GestureDetector(
                        onTap: _navigateToCurrentLocationView,
                        child: Padding(
                          padding: const EdgeInsets.only(top: 5),
                          child: Text(
                            _actualLocation ?? "Fetching location...",
                            style: TextStyle(
                                color: TColor.primaryText,
                                fontSize: 12,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: RoundTextfield(
                  hintText: "Search Delivery",
                  controller: txtSearch,
                  left: Container(
                    alignment: Alignment.center,
                    width: 30,
                    child: Image.asset(
                      "assets/img/search.png",
                      width: 20,
                      height: 20,
                    ),
                  ),
                  onChanged: (value) {
                    _filterSearchResults(value);
                  },
                ),
              ),
              const SizedBox(height: 30),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: ViewAllTitleRow(
                  title: "Available Deliveries",
                  onView: () {
                    setState(() {
                      _showAll = !_showAll;
                    });
                  },
                ),
              ),
              ListView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                padding: const EdgeInsets.symmetric(horizontal: 15),
                itemCount: _showAll
                    ? filteredArr.length
                    : (filteredArr.isEmpty
                        ? 0
                        : (filteredArr.length < 3 ? filteredArr.length : 3)),
                itemBuilder: ((context, index) {
                  if (filteredArr.isEmpty) {
                    return Center(child: Text("No items found."));
                  }
                  var rObj = filteredArr[index] as Map? ?? {};
                  return RecentItemRow(
                    foodName: rObj["food_name"],
                    organisationName: rObj["organisation_name"],
                    businessName: rObj["business_name"],
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ItemDetailsView(
                            itemDetails: rObj.cast<String, dynamic>(),
                            itemId: rObj["id"], // Passing the id
                          ),
                        ),
                      );
                    },
                  );
                }),
              )
            ],
          ),
        ),
      ),
    );
  }
}
