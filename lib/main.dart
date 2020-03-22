import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:liberum/frontend/home/main.dart';
import 'package:liberum/frontend/landing/main.dart';
import 'package:liberum/frontend/landing/pin.dart';

import 'package:liberum/network/account.dart';
import 'package:liberum/crypto/password.dart';
import 'package:liberum/network/network.dart';

class AccountModel extends ChangeNotifier {
  Account loginAccount;
  Network network;

  void login(String passwordString) {
    Password password = Password(passwordString);
    network = Network.logIn(loginAccount, password); // TODO: replace this with Persistence.logIn() or similar
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
        '/pin': (context) => EmojiPinScreen(),
        '/landing': (context) => LandingScreen(),
        // When navigating to the "/second" route, build the SecondScreen widget.
        '/': (context) => HomeScreen(),
      },
    );
  }
}
