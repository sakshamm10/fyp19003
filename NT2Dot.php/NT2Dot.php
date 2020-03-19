<?php
    require_once "EasyRdf.php";
    $graph = new EasyRdf_Graph();
    
    if ($argc > 2){
        echo "Usage: NT2Dot.php <file_path>\r\n";
        return;
    }

    $file_path = $argv[1];

    // Parse the input file (provide its path)
    $graph->parseFile($file_path, 'ntriples');

    // Lookup the output format
    $format = EasyRdf_Format::getFormat('dot');

    // Serialise to the new output format
    $output = $graph->serialise($format);

    echo $output;
?>