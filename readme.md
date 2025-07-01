# btlz-wb-test

Сервис для интеграции с Wildberries API и Google Sheets.

## Конфигурация

1. Создайте файл `.env` на основе `example.env`:
```bash
cp example.env .env
```

2. Заполните следующие переменные окружения в файле `.env`:

### База данных (PostgreSQL)
```env
POSTGRES_HOST=postgres     # Имя сервиса в Docker Compose
POSTGRES_PORT=5432         # Порт PostgreSQL
POSTGRES_DB=postgres       # Имя базы данных
POSTGRES_USER=postgres     # Пользователь базы данных
POSTGRES_PASSWORD=postgres # Пароль пользователя
```

### Настройки приложения
```env
APP_PORT=3000             # Порт на котором будет запущено приложение
NODE_ENV=production       # Окружение: "production" запустит почасовой кронтаб / "development" поминутный
```

### Wildberries API
```env
WB_API_KEY=your_wb_api_key  # API ключ Wildberries
```

### Google Sheets
```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id      # ID таблицы Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key            # Приватный ключ сервисного аккаунта (допустимо со спецсимволами переноса строки)
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email # Email сервисного аккаунта
```

Для настройки Google Sheets:
1. Предоставьте доступ к таблице для email сервисного аккаунта
2. В таблице создайте лист "stocks_coefs"

## Запуск

1. Убедитесь, что все переменные окружения настроены правильно в файле `.env`

2. Запустите приложение с помощью Docker Compose:
```bash
docker compose up
```

## Остановка

Для остановки приложения выполните:
```bash
docker compose down
```