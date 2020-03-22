import 'package:flutter/material.dart';
import 'package:liberum/frontend/landing/EmojiSubsetInput.dart';
import 'package:liberum/main.dart';
import 'package:provider/provider.dart';
import 'package:liberum/crypto/password.dart';

class EmojiPinScreen extends StatefulWidget {
  const EmojiPinScreen({
    Key key,
  }) : super(key: key);

  @override
  _EmojiPinScreenState createState() => _EmojiPinScreenState();
}

class _EmojiPinScreenState extends State<EmojiPinScreen> {
  String _password = '';
  String _passwordHint = 'Password';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextField(
                      onChanged: (value) => this.setState(() {
                        _password = value;
                      }),
                      decoration:
                          InputDecoration(labelText: this._passwordHint),
                    ),
                    EmojiSubsetInput(),
                    Consumer<AccountModel>(builder: (context, state, child) {
                      return new Padding(
                          padding: EdgeInsets.all(16),
                          child: RaisedButton(
                              child: Icon(Icons.arrow_forward, size: 24),
                              color: Colors.blue,
                              textColor: Colors.white,
                              onPressed: () {
                                try {
                                  state.login(this._password);
                                  Navigator.pushReplacementNamed(context, '/');
                                } on BadPasswordException {
                                  this.setState(() {
                                    _password = '';
                                    _passwordHint =
                                        'Password was wrong! Try again please.';
                                  });
                                }
                              }));
                    })
                  ]))),
    );
  }
}
