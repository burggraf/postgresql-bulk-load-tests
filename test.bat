@rem download timer.exe from https://www.gammadyne.com/timer.exe 
@psql -q -U postgres -f users_create.sql
@echo create 100k users with individual insert statements
@timer /q && psql -q -U postgres -f users_single.sql && timer /q /s
@psql -q -U postgres -f users_create.sql
@echo create 100k users with individual insert statements in a transaction
@timer /q && psql -q -U postgres -f users_single_transaction.sql && timer /q /s
@psql -q -U postgres -f users_create.sql
@echo create 100k users with batch insert statement
@timer /q && psql -q -U postgres -f users_batch.sql && timer /q /s
@psql -q -U postgres -f users_create.sql
@echo create 100k users with batch insert statement in a transaction
@timer /q && psql -q -U postgres -f users_batch_transaction.sql && timer /q /s

