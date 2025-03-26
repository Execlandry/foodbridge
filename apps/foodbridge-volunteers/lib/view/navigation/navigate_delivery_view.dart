import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:foodbridge-volunteers/view/payment/payment.dart';
// import 'package:foodbridge-volunteers/view/payment/qrcode_view.dart';
import 'package:latlong2/latlong.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'package:foodbridge-volunteers/common_widget/round_button.dart';
import 'package:foodbridge-volunteers/common_widget/round_textfield.dart';
import 'package:flutter_compass/flutter_compass.dart';

import '../../common/color_extension.dart';

class NavigateDeliveryView extends StatefulWidget {
  final String pickupLocation;
  final String dropLocation;
  final double amount;

  const NavigateDeliveryView({
    super.key,
    required this.pickupLocation,
    required this.dropLocation,
    required this.amount,
  });

  @override
  State<NavigateDeliveryView> createState() => _NavigateDeliveryViewState();
}

class _NavigateDeliveryViewState extends State<NavigateDeliveryView> {
  final MapController _mapController = MapController();
  final TextEditingController otpController = TextEditingController();
  final Location _locationService = Location();
  double _currentHeading = 0.0; // Store the device's heading

  bool _isLoading = true;
  bool _isNavigating = false;
  LatLng? _currentLocation;
  LatLng? _destination;
  List<LatLng> _route = [];

  @override
  void initState() {
    super.initState();
    _initializeLocation();
    _listenToCompass();
  }

  void _listenToCompass() {
    FlutterCompass.events!.listen((CompassEvent event) {
      if (mounted) {
        setState(() {
          _currentHeading = event.heading ?? 0.0;
        });
      }
    });
  }

  Future<void> _initializeLocation() async {
    if (!await _checkAndRequestPermission()) return;

    _locationService.onLocationChanged.listen((LocationData locationData) {
      if (locationData.latitude != null && locationData.longitude != null) {
        setState(() {
          _currentLocation =
              LatLng(locationData.latitude!, locationData.longitude!);
          _isLoading = false;
        });
        // Move map to the updated location if navigation is active
        if (_isNavigating) {
          _mapController.move(_currentLocation!, 20);
        }
        if (_destination != null) {
          _fetchRoute();
        }
      }
    });
    await _fetchCoordinates(widget.dropLocation);
  }

  Future<bool> _checkAndRequestPermission() async {
    bool serviceEnabled = await _locationService.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await _locationService.requestService();
      if (!serviceEnabled) return false;
    }
    PermissionStatus permissionGranted = await _locationService.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await _locationService.requestPermission();
      if (permissionGranted != PermissionStatus.granted) return false;
    }
    return true;
  }

  Future<void> _fetchCoordinates(String location) async {
    final url = Uri.parse(
        'https://nominatim.openstreetmap.org/search?q=$location&format=json&limit=1');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data.isNotEmpty) {
          final lat = double.parse(data[0]['lat']);
          final lon = double.parse(data[0]['lon']);
          setState(() {
            _destination = LatLng(lat, lon);
          });
          _fetchRoute();
        }
      }
    } catch (e) {
      print("Exception in fetching coordinates: $e");
    }
  }

  Future<void> _fetchRoute() async {
    if (_currentLocation == null || _destination == null) return;
    final url = Uri.parse('http://router.project-osrm.org/route/v1/driving/'
        '${_currentLocation!.longitude},${_currentLocation!.latitude};'
        '${_destination!.longitude},${_destination!.latitude}?overview=full&geometries=polyline');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['routes'].isNotEmpty) {
          final geometry = data['routes'][0]['geometry'];
          final routePolyline = _decodePolyline(geometry);
          setState(() {
            _route = routePolyline
                .map((point) => LatLng(point[0], point[1]))
                .toList();
          });
        }
      }
    } catch (e) {
      print("Exception in fetching route: $e");
    }
  }

  List<List<double>> _decodePolyline(String polyline) {
    const factor = 1e5;
    List<List<double>> points = [];
    int index = 0, lat = 0, lon = 0;
    while (index < polyline.length) {
      int result = 0, shift = 0, byte;
      do {
        byte = polyline.codeUnitAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lat += (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      result = shift = 0;
      do {
        byte = polyline.codeUnitAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lon += (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      points.add([lat / factor, lon / factor]);
    }
    return points;
  }

  void _startNavigation() {
    if (_currentLocation != null) {
      setState(() {
        _isNavigating = true;
      });

      // Smooth zoom transition
      double startZoom = _mapController.camera.zoom;
      double targetZoom = 20;
      int steps = 10; // Number of zoom steps
      Duration stepDuration = Duration(milliseconds: 100); // Duration per step

      for (int i = 1; i <= steps; i++) {
        Future.delayed(stepDuration * i, () {
          if (mounted) {
            double newZoom = startZoom + (targetZoom - startZoom) * (i / steps);
            _mapController.move(_currentLocation!, newZoom);
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: TColor.white,
        title: Text("Navigate to Delivery",
            style: TextStyle(
                color: TColor.primaryText,
                fontSize: 20,
                fontWeight: FontWeight.w800)),
      ),
      body: Stack(
        children: [
          Column(
            children: [
              Expanded(
                  child: _isLoading
                      ? Center(child: CircularProgressIndicator())
                      : FlutterMap(
                          mapController: _mapController,
                          options: MapOptions(
                            initialCenter: _currentLocation ?? LatLng(0, 0),
                            initialZoom: _isNavigating
                                ? 20
                                : 13, // Change zoom when navigating
                          ),
                          children: [
                            TileLayer(
                              urlTemplate:
                                  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            ),
                            if (_currentLocation != null)
                              MarkerLayer(
                                markers: [
                                  Marker(
                                    point: _currentLocation!,
                                    child: Transform.rotate(
                                      angle: _currentHeading *
                                          (3.14159265359 /
                                              180), // Convert degrees to radians
                                      child: Icon(Icons.navigation,
                                          color: Colors.blue, size: 40),
                                    ),
                                  ),
                                  if (_destination !=
                                      null) // Destination marker
                                    Marker(
                                      point: _destination!,
                                      width: 80.0,
                                      height: 80.0,
                                      child: const Icon(
                                        Icons.location_pin,
                                        size: 40.0,
                                        color: Colors.red,
                                      ),
                                    ),
                                ],
                              ),
                            if (_route.isNotEmpty)
                              PolylineLayer(
                                polylines: [
                                  Polyline(
                                    points: _route,
                                    strokeWidth: 5.0,
                                    color: Colors.red,
                                  ),
                                ],
                              ),
                          ],
                        )),
              Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 25, vertical: 20), // Add vertical padding
                child: RoundButton(
                  title: "Show OTP Sheet",
                  onPressed: _showOtpBottomSheet,
                ),
              ),
            ],
          ),
          Positioned(
            top: 20,
            right: 20,
            child: ElevatedButton(
              onPressed: _isNavigating
                  ? null
                  : _startNavigation, // Disable when navigating
              child: Text(_isNavigating ? "Navigating..." : "Start Navigation"),
            ),
          ),
        ],
      ),
    );
  }

  void _showOtpBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom +
                20, // Extra bottom padding
          ),
          child: Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 10), // Spacing at the top
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 25),
                  child: RoundTextfield(
                    hintText: "Enter 6-digit OTP",
                    controller: otpController,
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 25),
                  child: RoundButton(
                    title: "Order Delivered",
                    onPressed: () {
                      Navigator.pop(context); // Close modal before navigation
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => Payment(amount: widget.amount),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 20), // Extra spacing at the bottom
              ],
            ),
          ),
        );
      },
    );
  }
}
