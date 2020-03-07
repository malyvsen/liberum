import 'package:flutter/material.dart';
import 'package:liberum/main.dart';
import 'package:liberum/network/network.dart';
import 'package:provider/provider.dart';

class LandingScreen extends StatelessWidget {
  List<Widget> getAccounts(context) {
    List<Widget> list = new List<Widget>();
    var accounts = Network.loggableAccounts;
    for (var i = 0; i < accounts.length; i++) {
      list.add(Consumer<AccountModel>(builder: (_context, state, child) {
        return new ListTile(
            onTap: () {
              state.setLoginAccount(accounts[i]);
              Navigator.pushReplacementNamed(context, '/pin');
            },
            title: Text(accounts[i].name),
            subtitle: Text(accounts[i].key.publicFingerprint));
      }));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Text('Select an account'),
        ...getAccounts(context),
      ])),
    );
  }
}
