import 'package:flutter/material.dart';
import 'package:liberum/main.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Home'),
        ),
        body: Center(
          child: 
      Consumer<AccountModel>(builder: (_context, state, child) {
          return new Text(
              "Hello ${state.network.currentAccount.name}. You're so trusted (${state.network.currentAccount.getTrustOf(state.network.currentAccount)}).");
      })
        ));
  }
}
