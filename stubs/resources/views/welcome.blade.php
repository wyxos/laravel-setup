<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="An app to build and manage lists of tasks.">
    <title>{{ config('app.name') }}</title>
    <link rel="canonical"
          href="{{ url()->current() }}"/>
    @vite('resources/app/js/main.js')
</head>
<body class="antialiased">
<div id="app">
    <h1>Your new app is ready</h1>
    <p>Build something awesome!</p>
    <o-button @click="helloWorld()">Click me</o-button>
</div>
</body>
</html>
