## [1.0.10]
### Fixed
- Исправлена интерпретация значения expiresIn при логине и рефреше

## [1.0.9]
### Fixed
- Что было сделано в этой версии, к сожалению, никто не знает

## [1.0.8]
### Added
- Добавлена возможность установить credentials извне

## [1.0.7]
### Fixed
- Исправлен работа авторизации при включении Basic авторизации для доступа к веб приложению

## [1.0.6]
### Fixed
- Фикс fetchAccessToken в createTokenRefreshLink

## [1.0.5]
### Fixed
- Правка в функции для проверки на валидность токена в AuthClient
- Теперь expiresIn переводится в миллисекунды внутри функций в AuthClient
- Правильная реализация метода isTokenValidOrUndefined в createTokenRefreshLink

## [1.0.4]
### Added
- Новый тест для GraphQlClient
### Fixed
- Неправильно обрабатывалась ошибка в ответе от сервера в GraphQlClientImpl

## [1.0.3]
### Added
- CHANGELOG.md
### Changed
- Метод logout у Auth-client теперь сбрасывает this.credentials


## [1.0.2]
### Changed
- README.md


## [1.0.0]
### LIB RELSEASE