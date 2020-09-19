# Библиотека для авторизации 

## Сборка и публикация

Сперва надо авторизоваться в npm registry
```
npm login --registry http://hub.sebbia.org/repository/npm-releases
```

Затем собрать и опубликовать
```
npm i
npm run build
npm publish --registry http://hub.sebbia.org/repository/npm-releases
```

## Использование

***
GraphQlClientImpl:

Клиент для запросов. Для инициализации необходим graphQlEndpoint: string и timeoutInMs
Методы:
* **executeRequest(query: string, variables: any): Promise<any>** - принимает запрос и переменные для него, возвращает промис с res.data
***

***
interface CredentialStorage:

все хранилища имеют методы:

* **getCredentials(): Promise<Credentials | null>** - возвращает промис с токенами
* **setCredentials(credentials: Credentials): Promise<void>** - записывает токены в хранилище
* **clearCredentials(): Promise<void>** - чистит хранилище
***

LocalCredentialStorage implements CredentialStorage
Локальное хранилище токенов. Для инициализации необходима строка, в последствии являющаяся ключом к токенам в localStorage
***

CrossDomainCredentialStorage implements CredentialStorage
Кроссдоменное хранилище токенов. Для инициализации необходимы строка url ссылка на домен для хранение токенов, serviceID, такой же как и на домене, и timeoutInMs

***

AuthClient

Клиент авторизации. Для инициализации необходим GraphQlClient и CredentialStorage

Методы:

* **isAuthorized(): boolean** - проверка первичной авторизации. Возвращает true если клиент авторизирован
* **login(login: string, password: string)** - Метод логина. Принимает логин и пароль, вызывает setCredentials с полученными токенами
* **logout()** - вызывает clear у CredentialStorage
* **refresh()** - обновляет токены и вызывает setCredentials с новыми полученными токенами
* **tryToRefreshToken()** - то же что и refresh, но с проверкой на валидность текущих токенов. Если не валидны - вызывается refresh

Публичные поля:
* **credentials: Credentials** - объект с текущими токенами. По умолчанию null

***

function * **createTokenRefreshLink(authClient: AuthClient): TokenRefreshLink**

Оборачивает AuthClient в обертку TokenRefreshLink


Пример использования:
```js

import LocalCredentialStorage from './node_modules/@sebbia/auth-client/LocalCredentialStorage.ts'
import GraphQlClientImpl from './node_modules/@sebbia/auth-client/GraphQLClientImpl.ts'
import AuthClient from './node_modules/@sebbia/auth-client/AuthClient.ts'


const storage = new LocalCredentialStorage('credentials')
const grapfQlClient = new GraphQlClientImpl('test.api.com', 5000)
const authClient = new AuthClient(storage, grapfQlClient)

authClient.login("70000000000", 'admin');
const credentials = authClient.credentials;

```