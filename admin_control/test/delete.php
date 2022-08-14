<?php
$path = "uploads/Untitled.png";
if(!unlink($path))
{
    echo "Not Working";
}
else {
    // execute the command from database now.
}
?>