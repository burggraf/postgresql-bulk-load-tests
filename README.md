# Speeding Up Bulk Loading in PostgreSQL
Testing 4 ways to bulk load data into PostgreSQL

## The Need For Speed
If you only need to load a few hundred records into your database, you probably aren't too concerned about efficiency.  But what happens when try to insert thousands, or even millions of records?  Now, data-loading efficiency can mean the difference between success and failure for your project, or at the very least the difference between a project that’s delivered timely and one that’s woefully overdue.

PostgreSQL has a great **copy** command that’s optimized for this task: [https://www.postgresql.org/docs/current/sql-copy.html](https://www.postgresql.org/docs/current/sql-copy.html).  But that’s only a good solution if your data is specifically in a CSV (or Binary) file.  But what if you need to load data from pure SQL? Then what’s the fastest way?

## Four Ways to Insert Data

### Basic Insert Commands

Let’s look at the structure for some basic SQL insert commands:

```sql
create table users (id integer, firstname text, lastname text);
insert into users (id, firstname, lastname) values (1, 'George', 'Washington');
insert into users (id, firstname, lastname) values (2, 'John', 'Adams');
insert into users (id, firstname, lastname) values (3, 'Thomas', 'Jefferson');
```

Now we have some basic SQL for inserting records into our user table. This will get the data into our table, alright, but it's the slowest way to get data into our table.  Let's look at some ways we can speed things up.

### Transactions

A quick and easy way to speed things up is simply to put large batches of insert statements inside a transaction:

```sql
begin transaction;
insert into users (id, firstname, lastname) values (1, 'George', 'Washington');
insert into users (id, firstname, lastname) values (2, 'John', 'Adams');
insert into users (id, firstname, lastname) values (3, 'Thomas', 'Jefferson');
commit;
```

In my Windows test, this doubled the speed of the insert of 100k user records.  Under MacOS, the speed tripled.  While you can technically create batches with billions of records in them, you'll probably want to experiment with batch sizes of, say 1000, 10000, 100000, or something like that to see what works best based on your hardware, bandwidth, and record size.

### Batched Inserts

Another way to speed things up is to use the SQL batch insert syntax when doing your insert.  For example:

```sql
insert into users (id, firstname, lastname) values 
  (1, 'George', 'Washington'),(2, 'John', 'Adams'),(3, 'Thomas', 'Jefferson');
```

This method speeds things up considerably.  In my tests, it was about 6 times faster.  The same rules apply to batch sizes as with transactions -- you'll want to test different batch sizes to optimize things.  I generally tend to start with a batch of around 10000 records for most applications and if that works well enough, I leave it there.

### What About Both?

Can you combine transactions and batch insert statements for even more speed?  Well, yes, and no.  You certainly can combine them, but the speed increase is negligible (or in my Windows test case it even slowed things down just a bit.)

```sql
begin transaction;
insert into users (id, firstname, lastname) values 
  (1, 'George', 'Washington'),(2, 'John', 'Adams'),(3, 'Thomas', 'Jefferson');
commit;
```

So, while using both techniques here is perfectly valid, it may not be the fastest way to load data.

## The Downsides

What are the potential downsides of using transactions or batched inserts?  Error handling is the main one.  If any one of the records in your batch fails, the entire batch will fail and no data will be inserted into your table from that batch.  So you'll need to make sure your data is valid or else have some way to break up and fix failed batches.

If the failure is caused by a unique constraint, you can use the [`on conflict`](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT) clause in your insert statement, but if your insert fails for any other reason, it'll throw out the whole batch.

## Other Speed Considerations

There are many other factors that can affect your data insert speed and ways you can make things even faster.  Removing indexes until after inserting data, creating non-logged tables, and avoiding unnecessary unique keys are just a few of these.  These other optimizations will improve performance, but probably not nearly as dramatically as the basic techniques described here.

## Conclusion

If you need to deal with large amounts of data, it pays to plan ahead when you're writing your SQL insert code.  A few small changes can potentially save you hours (or sometimes even days) or processing time.

#### Appendix: Sample Test Results

See my GitHub Repo [postgresql-bulk-load-tests](https://github.com/burggraf/postgresql-bulk-load-tests) for some code to test these methods.  My test run results are listed below.

```
===========================
Windows VM (UTM Windows 11)
===========================
create 100k users with individual insert statements
30.0 seconds
create 100k users with individual insert statements in a transaction
14.0 seconds
create 100k users with batch insert statement
4.3 seconds
create 100k users with batch insert statement in a transaction
4.6 seconds

====================
MacBook Pro (M1 Max)
====================
create 100k users with individual insert statements

real	0m9.112s
user	0m0.509s
sys   0m0.337s

create 100k users with individual insert statements in a transaction

real	0m2.540s
user	0m0.457s
sys   0m0.325s

create 100k users with batch insert statement

real	0m1.360s
user	0m0.179s
sys   0m0.042s

create 100k users with batch insert statement in a transaction

real	0m1.154s
user	0m0.189s
sys   0m0.041s
```
