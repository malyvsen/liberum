import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'dart:io';

import '../network/account.dart';
import '../network/account.dart';

class DatabaseHelper {
//singleton garbage
  static final DatabaseHelper _instance = DatabaseHelper._();
  static final String dbName = 'database.db';
  static Database _database;

  DatabaseHelper._();
  
  factory DatabaseHelper() {
    return _instance;
  }
  
  static Future<Database> get db async {
    if (_database != null) {
      return _database;
    }
    _database = await init();  
    return _database;
  }

  static Future<Database> init() async {
    var databasesPath = await getDatabasesPath();
    var dbPath = join(databasesPath, dbName);
    var database = openDatabase(dbPath, version: 1, onCreate: _onCreate);
    return database;
  }

  //DB events:
  //TODO: move long db configuration strings to a separate file
  static void _onCreate(Database db, int version) {
    //create accounts table
    db.execute('''
      CREATE TABLE accounts(
        fingerprint TEXT PRIMARY KEY NOT NULL,
        publicKey   TEXT UNIQUE,
        name        TEXT
        )
    ''');
    //create loggable-accounts table
    db.execute('''
      CREATE TABLE loggableAccounts(
        fingerprint TEXT PRIMARY KEY NOT NULL,
        localData TEXT,
        foreign key(fingerprint) references accounts(fingerprint)
      )
    ''');
    //create whoKnowsWhom table
    db.execute('''
      CREATE TABLE whoKnowsWhom(
        owner TEXT NOT NULL,
        known TEXT NOT NULL,
        foreign key(owner) references accounts(fingerprint),
        foreign key(known) references accounts(fingerprint),
        PRIMARY KEY(owner, known)
      )
    ''');
    //create links table
    db.execute('''
      CREATE TABLE links(
        ownerFingerprint  TEXT NOT NULL,
        fingerprint1      TEXT NOT NULL,
        fingerprint2      TEXT NOT NULL,
        signature1        TEXT NOT NULL,
        signature2        TEXT NOT NULL,
        validFrom         TEXT NOT NULL,
        foreign key(ownerFingerprint) references accounts(fingerprint),
        foreign key(fingerprint1)     references accounts(fingerprint),
        foreign key(fingerprint2)     references accounts(fingerprint),
        PRIMARY KEY(ownerFingerprint, fingerprint1, fingerprint2)
        )
    ''');

    print("Database was created!");
  }

  //TODO: yeet out to some repository n DAO pattern thingy
  static void saveAccount(Account account) async {
    var db = await DatabaseHelper.db;
    db.execute('''
    INSERT INTO accounts(fingerprint, publicKey, name)
    VALUES("${account.key.publicFingerprint}", "${account.key.publicKey}", "${account.name}")
    ''');
  }

}