psql -q postgres -f users_create.sql # Create users table
echo
echo "create 100k users with individual insert statements"
time psql -q postgres -f users_single.sql
psql -q postgres -f users_create.sql # Create users table
echo
echo "create 100k users with individual insert statements in a transaction"
time psql -q postgres -f users_single_transaction.sql
psql -q postgres -f users_create.sql # Create users table
echo
echo "create 100k users with batch insert statement"
time psql -q postgres -f users_batch.sql
psql -q postgres -f users_create.sql # Create users table
echo
echo "create 100k users with batch insert statement in a transaction"
time psql -q postgres -f users_batch_transaction.sql
echo