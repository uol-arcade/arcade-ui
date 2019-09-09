<?php namespace Arcade;

    /**
     * A class for listing files in a directory
     */
    class FileLister
    {
        /**
         * Returns a directory as a JS array
         */
        public static function listDirectoryJSArray($path)
        { 
            # Get the files in this directory
            $files = scandir($path); 

            foreach($files as $key => &$file)
            {
                if($file === '.' || $file == '..')
                    unset($files[$key]);

                $file = "'$file'";
            }

            # Now just whack them into a string and
            # return this
            return '[' . implode(',', $files) . ']';
        }
    }

?>