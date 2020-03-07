import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:liberum/frontend/home/main.dart';
import 'package:liberum/frontend/landing/main.dart';
import 'package:liberum/frontend/landing/pin.dart';

import 'package:liberum/network/account.dart';
import 'package:liberum/network/network.dart';

class AccountModel extends ChangeNotifier {
  /// Internal, private state of the cart.
  Account loginAccount;
  Network network;

  /// An unmodifiable view of the items in the cart.
  void login(password) {
    network = Network.logIn(loginAccount, password);
    notifyListeners();
  }

  void setLoginAccount(account) {
    loginAccount = account;
  }
}

void main() => runApp(ChangeNotifierProvider(
    create: (context) => AccountModel(), child: MyApp()));

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Liberum',
      // Start the app with the "/" named route. In this case, the app starts
      // on the FirstScreen widget.
      initialRoute: '/landing',
      routes: {
        // When navigating to the "/" route, build the FirstScreen widget.
        '/pin': (context) => PasswordScreen(),
        '/landing': (context) => LandingScreen(),
        // When navigating to the "/second" route, build the SecondScreen widget.
        '/': (context) => HomeScreen(),
      },
    );
  }
}
