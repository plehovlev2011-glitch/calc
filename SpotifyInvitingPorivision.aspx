<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SpotifyInvitingPorivision.aspx.cs" Inherits="ImageGallery.SpotifyInvitingPorivision" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <title>Галерея изображений</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background-color: black;
            overflow-x: hidden;
        }
        
        .image-container {
            width: 100%;
            margin: 0;
            padding: 0;
            line-height: 0;
        }
        
        .image-container img {
            width: 100%;
            height: auto;
            display: block;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Repeater ID="rptImages" runat="server">
                <ItemTemplate>
                    <div class="image-container">
                        <img src="<%# Container.DataItem %>" alt="Image" />
                    </div>
                </ItemTemplate>
            </asp:Repeater>
        </div>
    </form>
</body>
</html>
