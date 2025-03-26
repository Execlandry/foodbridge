import 'package:flutter/material.dart';
import '../common/color_extension.dart';

class RecentItemRow extends StatelessWidget {
  final String foodName;
  final String organisationName;
  final String businessName;
  final VoidCallback onTap;

  const RecentItemRow({
    super.key,
    required this.foodName,
    required this.organisationName,
    required this.businessName,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: onTap,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    foodName,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: TColor.primaryText,
                        fontSize: 18,
                        fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    organisationName,
                    textAlign: TextAlign.center,
                    style: TextStyle(color: TColor.secondaryText, fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    businessName,
                    textAlign: TextAlign.center,
                    style: TextStyle(color: TColor.secondaryText, fontSize: 12),
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
