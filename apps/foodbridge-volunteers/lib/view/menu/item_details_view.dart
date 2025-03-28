import 'package:flutter/material.dart';
import 'package:foodbridge-volunteers/common_widget/round_button.dart';
import 'package:foodbridge-volunteers/view/menu/checkout_view.dart';
import '../../common/color_extension.dart';
import '../more/my_order_view.dart';

class ItemDetailsView extends StatefulWidget {
  final Map<String, dynamic> itemDetails;
  final String itemId;

  const ItemDetailsView(
      {super.key, required this.itemDetails, required this.itemId});

  @override
  State<ItemDetailsView> createState() => _ItemDetailsViewState();
}

class _ItemDetailsViewState extends State<ItemDetailsView> {
  @override
  Widget build(BuildContext context) {
    var media = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: TColor.white,
      body: Stack(
        children: [
          Positioned(
            top: 0,
            child: Image.asset(
              "assets/img/volunteerjpg.jpg",
              width: media.width,
              height: media.width,
              fit: BoxFit.cover,
            ),
          ),
          SingleChildScrollView(
            child: Column(
              children: [
                SizedBox(height: media.width - 50), // Space for the image

                /// Scrollable section with a colored background
                Container(
                  width: media.width,
                  decoration: BoxDecoration(
                    color: Colors.white, // Light background
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      /// White details section
                      Container(
                        width: media.width * 1.0,
                        padding: const EdgeInsets.all(20),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(30),
                            topRight: Radius.circular(30),
                            bottomLeft: Radius.circular(30),
                            bottomRight: Radius.circular(30),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.itemDetails['food_name'],
                              style: TextStyle(
                                  color: TColor.primaryText,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w800),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              "Details of the delivery",
                              style: TextStyle(
                                  color: TColor.primaryText,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 10),

                            /// Details Section
                            _buildDetailRow("Item ID", widget.itemId),
                            _buildDetailRow("Business Name",
                                widget.itemDetails['business_name']),
                            _buildDetailRow("Organisation Name",
                                widget.itemDetails['organisation_name']),
                            _buildDetailRow("Pickup Location",
                                widget.itemDetails['pickup_location']),
                            _buildDetailRow("Drop Location",
                                widget.itemDetails['drop_location']),
                            _buildDetailRow("Food Quantity",
                                "${widget.itemDetails['food_quantity']} portions"),
                            _buildDetailRow("Distance",
                                "${widget.itemDetails['distance']}"),
                            _buildDetailRow(
                                "Total Amount",
                                widget.itemDetails['amount'] == 0
                                    ? "Free"
                                    : "\Rs ${widget.itemDetails['amount'].toStringAsFixed(2)}"),
                            // const SizedBox(height: 20),
                          ],
                        ),
                      ),

                      /// Button section with primary background starting from the left
                      SizedBox(
                        height: 180,
                        child: Stack(
                          alignment: Alignment.centerLeft,
                          children: [
                            /// Primary color background starting from the left
                            Positioned(
                              left: 0,
                              child: Container(
                                width: media.width * 0.25,
                                height: 160,
                                decoration: BoxDecoration(
                                  color: TColor.primary,
                                  borderRadius: const BorderRadius.only(
                                    topRight: Radius.circular(35),
                                    bottomRight: Radius.circular(35),
                                  ),
                                ),
                              ),
                            ),

                            Center(
                              child: Stack(
                                alignment: Alignment.centerRight,
                                children: [
                                  Container(
                                      margin: const EdgeInsets.only(
                                          top: 8,
                                          bottom: 8,
                                          left: 10,
                                          right: 20),
                                      width: media.width - 80,
                                      height: 120,
                                      decoration: const BoxDecoration(
                                          color: Colors.white,
                                          borderRadius: BorderRadius.only(
                                              topLeft: Radius.circular(35),
                                              bottomLeft: Radius.circular(35),
                                              topRight: Radius.circular(35),
                                              bottomRight: Radius.circular(35)),
                                          boxShadow: [
                                            BoxShadow(
                                                color: Colors.black12,
                                                blurRadius: 12,
                                                offset: Offset(0, 4))
                                          ]),
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          SizedBox(
                                            width: 180,
                                            height: 65,
                                            child: RoundButton(
                                                title: "Accept Order",
                                                onPressed: () {
                                                  //
                                                  Navigator.push(
                                                    context,
                                                    MaterialPageRoute(
                                                      builder: (context) =>
                                                          CheckoutView(
                                                        pickupLocation: widget
                                                                .itemDetails[
                                                            'pickup_location'],
                                                        dropLocation: widget
                                                                .itemDetails[
                                                            'drop_location'],
                                                        amount: widget
                                                            .itemDetails[
                                                                'amount']
                                                            .toDouble(),
                                                      ),
                                                    ),
                                                  );
                                                }),
                                          )
                                        ],
                                      )),
                                  InkWell(
                                    onTap: () {
                                      // Navigator.push(
                                      //     context,
                                      //     MaterialPageRoute(
                                      //         builder: (context) =>
                                      //             const MyOrderView()));
                                    },
                                    child: Container(
                                      width: 45,
                                      height: 45,
                                      decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(22.5),
                                          boxShadow: const [
                                            BoxShadow(
                                                color: Colors.black12,
                                                blurRadius: 4,
                                                offset: Offset(0, 2))
                                          ]),
                                      alignment: Alignment.center,
                                      child: Image.asset(
                                          "assets/img/shopping_cart.png",
                                          width: 20,
                                          height: 20,
                                          color: TColor.primary),
                                    ),
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Column(
              children: [
                const SizedBox(
                  height: 35,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        icon: Image.asset(
                          "assets/img/btn_back.png",
                          width: 20,
                          height: 20,
                          color: TColor.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Text(
        "$title: $value",
        style: TextStyle(
          color: TColor.primaryText,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

 /// Helper Method to Build Detail Row

