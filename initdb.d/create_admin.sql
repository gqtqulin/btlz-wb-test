DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = 'admin'
    ) THEN
        CREATE USER admin WITH SUPERUSER PASSWORD 'admin';
    END IF;
END
$$;

-- Даём пользователю доступ к БД 'postgres' (если нужно)
GRANT CONNECT ON DATABASE postgres TO admin;

-- Даём доступ к схеме public
GRANT USAGE ON SCHEMA public TO admin;

-- Разрешаем чтение и запись для всех существующих таблиц
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;

-- Разрешаем использование последовательностей (для автоинкремента)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Для новых таблиц, которые будут созданы позже
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO admin;