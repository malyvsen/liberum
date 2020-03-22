import 'package:flutter/material.dart';
import 'package:liberum/main.dart';
import 'package:liberum/network/network.dart';
import 'package:provider/provider.dart';

class LandingScreen extends StatelessWidget {
  List<Widget> getAccounts(context) {
    List<Widget> list = new List<Widget>();
    var accounts = Network.loggableAccounts;
    // add potential accounts from BT, Wi-Fi, NFC, etc... :)
    // change their icon to connectivity
    for (var i = 0; i < accounts.length; i++) {
      list.add(Consumer<AccountModel>(builder: (context, state, child) {
        return new ListTile(
            onTap: () {
              state.setLoginAccount(accounts[i]);
              Navigator.pushNamedAndRemoveUntil(context, '/pin', (_) => false);
            },
            leading: Icon(Icons.account_circle, size: 48),
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
        Padding(
            child: Text(
              'Select an account',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            padding: EdgeInsets.all(32)),
        ...getAccounts(context),
      ])),
    );
  }
}
