import 'package:flutter/material.dart';

class LandingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              child: Text("Welcome to Liberum. You've landed!"),
              padding: const EdgeInsets.all(16),
            ),
            RaisedButton(
              child: Text("Let's go in"),
              padding: const EdgeInsets.all(16),
              onPressed: () {
                // Navigate to the second screen using a named route.
                Navigator.pushReplacementNamed(context, '/home');
              },
            ),
          ]),
    );
  }
}
