using System;
using System.Collections.Generic;

namespace ImageGallery
{
    public partial class SpotifyInvitingPorivision : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                List<string> images = new List<string>
                {
                    "1.png",
                    "2.png", 
                    "3.png"
                };
                
                rptImages.DataSource = images;
                rptImages.DataBind();
            }
        }
    }
}
