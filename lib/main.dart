import 'package:flutter/material.dart';

import 'package:liberum/frontend/home/main.dart';
import 'package:liberum/frontend/landing/main.dart';

void main() => runApp(MyApp());

class MyApp extends StatefulWidget {
  @override
  MyAppState createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  var account = 1;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Liberum',
      // Start the app with the "/" named route. In this case, the app starts
      // on the FirstScreen widget.
      initialRoute: '/landing',
      routes: {
        // When navigating to the "/" route, build the FirstScreen widget.
        '/landing': (context) => LandingScreen(),
        // When navigating to the "/second" route, build the SecondScreen widget.
        '/': (context) => HomeScreen(),
      },
    );
  }
}
