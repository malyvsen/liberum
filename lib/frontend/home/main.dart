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
            child: Consumer<AccountModel>(builder: (_context, state, child) {
          if (state.network != null && state.network.loggedInAccount != null) {
            return new Text(
                "Hello ${state.network.loggedInAccount.name}. You're so trusted (${state.network.loggedInAccount.getTrustOf(state.network.loggedInAccount)}).");
          } else {
            return new Text("");
          }
        })));
  }
}
