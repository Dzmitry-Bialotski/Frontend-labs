## Belotskiy Dmitriy 853504
### lab 1
### Task description
Create a console messaging application. No separate client / server applications are allowed. After the launch, client can choose the display name. This name will be used later to identify the sender of the message. Message exchange to be performed via manual socket management. You can use any programming language of your choice.

### 3 variation
Initial connection and message exchange via UDP. Only one to one connection is supported.
Message order control. Each message should contain order-related parameter, so that receiving client could display messages in the right order. Both clients should somehow control that no messages were lost on their way to receiver.