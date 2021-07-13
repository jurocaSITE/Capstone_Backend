\echo 'Delete and recreate teca db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE teca;
CREATE DATABASE teca;
\connect teca

\i teca-schema.sql

-- \echo 'Delete and recreate teca_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' answer

-- DROP DATABASE teca_test;
-- CREATE DATABASE teca_test;
-- \connect teca_test

-- \i teca-schema.sql