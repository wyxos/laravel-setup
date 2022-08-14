<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="App description">
    <title>{{ config('app.name') }}</title>
    <link rel="canonical"
          href="{{ url()->current() }}"/>
    @if(app()->environment('production'))
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('google-analytics.id') }}"></script>
        <script>
            window.dataLayer = window.dataLayer || []

            function gtag () {
                dataLayer.push(arguments)
            }

            gtag('js', new Date())

            gtag('config', {{ config('google-analytics.id') }})
        </script>
    @endif
    @vite('resources/js/app.js')
</head>
<body class="antialiased">
<div id="app">
    <h1>Your new app is ready</h1>
    <p>Build something awesome!</p>
    <o-button @click="helloWorld()">Click me</o-button>
</div>
</body>
</html>
