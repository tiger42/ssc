<?php
    $tstamps = [
        1276179716, 946721472, 1230750785, 162993600, 915091688, 915233003,
        915278400, 915364800, 915451200, 1218686722, 1293796800, 1293883200,
        1293969600, 1294056000, 1262260800, 1262347200, 1262520000, 1262606400,
        725803200, 725889600, 726062400, 726148800, 1009800000, 1009886400,
        1009713600, 1041336000, 1041768000, 1041854400, 1041249600, 1041163200,
        585266400, 949456922, 1075860264, 1013602393];
    $codes = ['d', 'D', 'j', 'l', 'N', 'S', 'w', 'z', 'W', 'F', 'm', 'M', 'n',
        't', 'L', 'o', 'Y', 'y', 'a', 'A', 'B', 'g', 'G', 'h', 'H', 'i', 's', 'u',
        /*'e',*/ 'I', 'O', 'P', /*'T',*/ 'Z', 'c', 'r', 'U'];
?>
<!DOCTYPE html>
<html>
<head>
    <title>Date</title>
    <script type="text/javascript" src="../../ssc.date.js"></script>
    <script type="text/javascript" src="../ssc.test.js"></script>

    <script type="text/javascript">
        function run() {
            document.open();
            document.write('<h2>Date</h2>');
            document.write('<pre>');

            document.write('<table border="1" cellspacing="0" cellpadding="2"><tr><th>Timestamp</th>');
            <?php foreach ($codes as $code): ?>
                document.write('<th><?php echo $code ?></th>')
            <?php endforeach ?>
            let tstamp, formatted;
            try {
                <?php foreach ($tstamps as $tstamp): ?>
                    <?php $msecs = sprintf('%03d', rand(0, 999)); ?>
                    tstamp = <?php echo $tstamp . $msecs?>;
                    document.write('<tr>');
                    document.write('<td>' + tstamp + '</td>');
                    <?php foreach ($codes as $code): ?>
                        formatted = SSC.Date.format(new Date(tstamp), '<?php echo $code ?>');
                        document.write('<td style="white-space: nowrap;">');
                        SSC.Test.assertSame('<?php
                            $d = new DateTime(date('Y-m-d H:i:s.' . $msecs, $tstamp));
                            echo $d->format($code);
                        ?>', formatted, formatted);
                        document.write('</td>');
                    <?php endforeach ?>
                    document.write('</tr>');
                <?php endforeach ?>
                document.write('</table>');

                SSC.Test.writeTestResult();
            } catch (e) {
                document.write('</td></tr></table>');
                document.write(`<b style="color: red;">EXCEPTION</b> caught: <b>${e.name}: ${e.message}</b>`);
                alert('Exception thrown!');
            }

            document.write('</pre>');
            document.close();
        }
    </script>
</head>

<body onload="run();">
</body>
</html>
