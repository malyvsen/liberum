import 'package:flutter/material.dart';
// import 'package:flutter_blue/flutter_blue.dart';

class LandingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(
          child: Text("Welcome to Liberum. You've landed!"),
          padding: const EdgeInsets.all(16),
        ),
        RaisedButton(
          child: Text("Let's go in"),
          padding: const EdgeInsets.all(16),
          onPressed: () {
            // fix this somehow
            Navigator.pushReplacementNamed(context, '/');
            Navigator.of(context).popUntil((route) => route.isFirst);
          },
        ),
      ])),
    );
  }
}
