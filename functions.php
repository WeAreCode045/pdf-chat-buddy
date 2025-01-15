<?php
// Enable CORS for all requests
function add_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    
    }
}
add_action('init', 'add_cors_headers');



    $body = wp_remote_retrieve_body($response);
    $content_type = wp_remote_retrieve_header($response, 'content-type');

    // Ensure we're sending PDF content type
    if (empty($content_type)) {
        $content_type = 'application/pdf';
    }

    // Set headers for PDF response
    header('Content-Type: ' . $content_type);
    header('Content-Length: ' . strlen($body));
    header('Content-Disposition: inline; filename="document.pdf"');
    header("Access-Control-Allow-Origin: *");

    
    echo $body;
    exit;
}