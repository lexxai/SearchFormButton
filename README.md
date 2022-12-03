# SearchFormButton

Google Chrome Exension 

Sometimes it is necessary to do repetitive tasks on certain pages. One of them was for me the task of pressing a certain button on the browser page under certain conditions.
Therefore, this application periodically searches the selected tabs of the browser for a certain HTML button for its software click according to certain rules and an optional delay before clicking.
The application is made more or less flexible, so that anyone can customize it to their own conditions of use.


Інколи необхідно на певних сторінках робити задачі котрі повторюються. Одною з таких стала для мене задача натискання на сторінці браузера певну кнопку за певними умовами.
Тому цей додаток робить періодичний пошук у вибраних вкладках браузера певної HTML кнопки для її програмного натискання за певними правилами та необов'язковою затримкою перед натисканням.
Додаток створено більш менш гнучким, щоб можна було будь кому налаштувати його під свої умови використання. 

Приклад коду де додаток може бути використаний.
```
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>TEST BUTTON</title>
  </head>
  <body>
    <p><br>
	<form id="f1">  	</form>
	 <button id="targetbtn" onclick="cli()" value="Start">Start</button>
    </p>  
	
   <script>
   function cli(){
    console.log('***********  Button fired ************');
   }
  </script>   
  </body>
</html>
```

Пошук об'єкту за id = targetbtn
``` <button id="targetbtn" ...  ```

Цей параметр змінюється у налаштуваннях.

У активній вкладці браузера відкриваємо зразок коду, в меню додатку натискаємо клавішу "Почати".

Після чого код додатку сканує HTML зміст вкладки на наявність об'єкту за id кожні 15 секунд. І якщо значення об'єкту (value) починається з “Start” то починається процес програмного натискання ( onClick() ) для знайденого об'єкту кнопки, але з затримкою на певний час  (котрий випадково варіюється від 1 до 10 хвилин).

Також можливо встановити збільшений час затримки від 1 до 30 хвилин в нічний час.

Додаток працює в кожній вкладці окремо, але зі спільними налаштуваннями.

На час затримки після об'єкту за id може бути додано інформаційний текст котрий показує залишок часу до натискання, та індикацію нічного часу роботи у вигляді іконки місяця. Цей параметр можна відключити.
![Screenshot 2022-05-17 023154-B02-1280](https://user-images.githubusercontent.com/3278842/168913967-48193e99-fe0c-4fcc-93b2-1f999ff79602.png)
![Screenshot 2022-05-17 023154-B03-1280](https://user-images.githubusercontent.com/3278842/168913969-fa7f289b-7058-4f83-9201-7b14d64076a6.png)
![Screenshot 2022-05-17 023154-B04-1280](https://user-images.githubusercontent.com/3278842/168913971-ec558c79-2909-4d22-9f23-44a0a15cd15f.png)
![Screenshot 2022-05-17 023154-B01-1280](https://user-images.githubusercontent.com/3278842/168913964-e1a2d0af-d13e-413a-9c27-028c26ce7d31.png)
![Screenshot 2022-05-17 023154-B06](https://user-images.githubusercontent.com/3278842/169706057-e67cca65-f89b-41ba-b749-a5e983a5eaaf.png)


Додаток публічнному доступі Chrome Google Web Store (Періодичне програмне натискання кнопки HTML / Periodic software click of HTML button): [https://chrome.google.com/webstore/detail/periodic-software-click-o/njbkhcajiabiodgmbilfinpdalneilfg?hl=uk&authuser=0
](https://chrome.google.com/webstore/detail/periodic-software-click-o/njbkhcajiabiodgmbilfinpdalneilfg?hl=uk&authuser=0)

Локалізацію створено за допомогою: [https://crowdin.com/project/searchformbutton](https://crowdin.com/project/searchformbutton)

