<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <p>Xin chào {{ $user->name ?? 'User' }},</p>
    <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link dưới đây để đặt lại mật khẩu:</p>
    <p><a href="{{ $url }}">Reset Password</a></p>
    <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
</body>
</html> 
