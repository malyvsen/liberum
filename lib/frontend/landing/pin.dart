import 'package:flutter/material.dart';
import 'package:liberum/main.dart';
import 'package:provider/provider.dart';

class PasswordScreen extends StatefulWidget {
  const PasswordScreen({
    Key key,
  }) : super(key: key);

  @override
  _PasswordScreenState createState() => _PasswordScreenState();
}

class _PasswordScreenState extends State<PasswordScreen> {
  var _password;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Text('Input password for this account'),
        TextField(
          onChanged: (value) => this.setState(() {
            _password = value;
          }),
          decoration: InputDecoration(labelText: 'Password'),
        ),
        Consumer<AccountModel>(builder: (context, state, child) {
          return new RaisedButton(
              child: Text('Enter'),
              onPressed: () {
                state.login(this._password);
                Navigator.pushReplacementNamed(context, '/');
              });
        })
      ])),
    );
  }
}
