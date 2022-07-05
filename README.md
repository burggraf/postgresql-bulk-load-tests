# Speeding Up Bulk Loading in PostgreSQL
Testing 4 ways to bulk load data into PostgreSQL

## The Need For Speed
If you only need to load a few hundred records into your database, you probably aren't too concerned about efficiency.  But what happens when try to insert thousands, or even millions of records?  Now, data-loading efficiency can mean the difference between success and failure for your project, or at the very least the difference between a project that’s delivered timely and one that’s woefully overdue.

PostgreSQL has a great **copy** command that’s optimized for this task: [https://www.postgresql.org/docs/current/sql-copy.html](https://www.postgresql.org/docs/current/sql-copy.html).  But that’s only a good solution if your data is specifically in a CSV (or Binary) file.  But what if you need to load data from pure SQL? Then what’s the fastest way?

## Basic Insert Commands

Let’s look at the structure for some basic SQL insert commands:

```sql
create table users (id integer, firstname text, lastname text);
insert into users (id, firstname, lastname) values (1, 'George', 'Washington');
insert into users (id, firstname, lastname) values (2, 'John', 'Adams');
insert into users (id, firstname, lastname) values (3, 'Thomas', 'Jefferson');
```

Now we have some basic SQL for inserting records into our user table. This will get the data into our table, alright, but it's the slowest way to get data into our table.  Let's look at some ways we can speed things up.

## Transactions

A quick and easy 

### Appendix: Sample Test Results

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
sys	    0m0.337s

create 100k users with individual insert statements in a transaction

real	0m2.540s
user	0m0.457s
sys	  0m0.325s

create 100k users with batch insert statement

real	0m1.360s
user	0m0.179s
sys	  0m0.042s

create 100k users with batch insert statement in a transaction

real	0m1.154s
user	0m0.189s
sys	  0m0.041s
```
