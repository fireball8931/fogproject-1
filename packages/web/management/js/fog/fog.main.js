$(function() {
    $('input,select,textarea').not('[type="checkbox"],[name="storagesel"],[name="ulang"]').click(function() {
        field = $(this);
        if (!field.is(':focus')) field.next('i').hide();
        if (field.is(':focus')) field.append('<i class="fa fa-pencil fa-1x fa-fw"></i>');
    });
    $('#refinesearch').remove();
    // Advanced Tasks stuff
    $('.advanced-tasks-link').click(function() {
        $(this).parents('tr').toggle('fast', function() {
            $('#advanced-tasks').toggle('slow');
        });
        $(this).parents('tr').toggle('fast');
        event.preventDefault();
    });
    $('#FOG_QUICKREG_IMG_ID').change(function() {
        $.ajax({
            url: '?node=about',
            cache: false,
            type: 'POST',
            data: {
                sub: 'getOSID',
                image_id: $(this).val()
            },
            success: function(data) {
                $('#FOG_QUICKREG_OS_ID').html(data.replace(/\"/g,""));
            }
        });
    });
    // Make button
    $('#adClear').html('<br/><input type="button" id="clearAD" value="Clear Fields"></input>');
    // Clear fields
    $('#clearAD').click(function() {
        $('#adEnabled').prop('checked',false);
        $('#adOU').is('input:text') ? $('#adOU').val('') : null;
        $('#adDomain').val('');
        $('#adUsername').val('');
        $('#adPassword').val('');
        $('#adPasswordLegacy').val('');
    });
    // Bind to AD Settings checkbox
    $('#adEnabled').change(function() {
        if ($(this).is(':checked')) {
            if ($('#adDomain').val() == '' || $('#adUsername').val() == '' ||  $('#adPassword').val() == '' || $('#adPasswordLegacy').val() == '') {
                $.ajax({
                    url: '../management/index.php',
                    type: 'POST',
                    timeout: 1000,
                    data: {
                        sub: 'adInfo'
                    },
                    dataType: 'json',
                    success: function(data) {
                        if ($('#adDomain').val() == '') $('#adDomain').val(data['domainname']);
                        if ($('#adUsername').val() == '') $('#adUsername').val(data['domainuser']);
                        if ($('#adPassword').val() == '') $('#adPassword').val(data['domainpass']);
                        if ($('#adPasswordLegacy').val() == '') $('#adPasswordLegacy').val(data['domainpasslegacy']);
                        if ($('#adOU').is('input:text') && $('#adOU').val() == '') $('#adOU').val(data['ou']);
                    }
                });
            }
        }
    });
    var allRadios = $('.primary,.default');
    var radioChecked;
    var setCurrent = function(e) {
        var obj = e.target;
        radioChecked = $(obj).is(':checked');
    }
    var setCheck = function(e) {
        if (e.type == 'keypress' && e.charCode != 32) return false;
        var obj = e.target;
        $(obj).prop('checked',!radioChecked);
    }
    $.each(allRadios, function(i, val) {
        var label = $('label[for='+$(this).prop('id')+']');
        $(this).bind('mousedown keydown', function(e) {
            setCurrent(e);
        });
        label.bind('mousedown keydown', function(e) {
            e.target = $('#'+$(this).attr("for"));
            setCurrent(e);
        });
        $(this).bind('click', function(e) {
            setCheck(e);
        });
    });
    $('.trigger_expand').click(function() {
        var all = $('.expand_trigger'),
        active = all.filter('.active');
        if (all.length && all.length === active.length) {
            // All open; close them
            all.removeClass('active').next().slideUp();
            $('.trigger_expand').html('<a href="#" class="trigger_expand"><h3>Expand All</h3></a>');
        } else {
            all.not('.active').addClass('active').next().slideDown();
            $('.trigger_expand').html('<a href="#" class="trigger_expand"><h3>Collapse All</h3></a>');
        }
        return false;
    });
    // Assign DOM elements
    if (typeof($("#pigz").slider) == typeof(Function)) {
        $("#pigz").slider({
            min: 0,
            max: 9,
            range: 'min',
            value: $("#showVal").val(),
            slide: function(event, ui) {
                $("#showVal").val(ui.value);
            }
        });
    }
    if (typeof($("#loglvl").slider) == typeof(Function)) {
        $("#loglvl").slider({
            min: 0,
            max: 7,
            range: 'min',
            value: $("#showlogVal").val(),
            slide: function(event, ui) {
                $("#showlogVal").val(ui.value);
            }
        });
    }
    if (typeof($("#inact").slider) == typeof(Function)) {
        $("#inact").slider({
            min: 1,
            max: 24,
            range: 'min',
            value: $("#showValInAct").val(),
            slide: function(event, ui) {
                $("#showValInAct").val(ui.value);
            }
        });
    }
    if (typeof($("#regen").slider) == typeof(Function)) {
        $("#regen").slider({
            step: 0.25,
            min: 0.25,
            max: 24,
            range: 'min',
            value: $("#showValRegen").val(),
            slide: function(event, ui) {
                $("#showValRegen").val(ui.value);
            }
        });
    }
    // Show Password information
    $(':password').not('[name="fakepasswordremembered"]').after('&nbsp;<i class="fa fa-eye-slash fa-2x"></i>&nbsp;');
    $(':password').next('i').mousedown(function() {
        $(this).removeClass('fa-eye-slash').addClass('fa-eye');
        $(this).prev('input').prop('type','text');
    }).mouseup(function() {
        $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        $(this).prev('input').prop('type','password');
    });
    // Process FOG JS Variables
    $('.fog-variable').fogVariable();
    // Process FOG Message Boxes
    $('.fog-message-box').fogMessageBox();
    // Placeholder support
    $('input[placeholder]').placeholder();
    // Nav Menu: Add hover label
    $('.menu li a').each(function() {
        $(this).tipsy({gravity: $.fn.tipsy.autoNS});
    });
    // Tooltips
    HookTooltips();
    // Search boxes
    $('.search-input').fogAjaxSearch();
    $('#content-inner').fogTableInfo();
    function format(icon) {
        if (!icon.id) return icon.text;
        var $icon = $('<i class="fa fa-'+icon.element.value.toLowerCase()+' fa-1x">'+icon.text+'</i>');
        return $icon;
    }
    $('select')
        .not('[name="storagesel"]')
        .select2();
    $('[name="icon"]')
        .select2({
            templateResult: format,
            templateSelection: format
        });
    $('#scheduleSingleTime').datetimepicker({
        dateFormat: 'yy/mm/dd',
        timeFormat: 'HH:mm'
    });
    // Snapin uploader for existing snapins
    $('#snapin-upload').click(function() {
        $('#uploader').html('<input type="file" name="snapin" />').find('input').click();
    });
    // Host Management - Select all checkbox
    $('.header input[type="checkbox"][name="no"]').click(function() {
        $('input[type="checkbox"][name^="HID"]').prop('checked',$(this).is(':checked'));
    });
    $('#checkAll').click(function() {
        selectAll = $(this).is(':checked');
        $('.checkboxes').each(function(){$(this).prop('checked',selectAll)});
    });
    // Tabs
    // Blackout - 9:14 AM 30/11/2011
    $('.organic-tabs').organicTabs({
        targetID: '#tab-container'
    });
    // Hides all the divs in the Service menu
    $('#tab-container-1 > div').hide();
    // Shows the div of the containing element.
    $('#tab-container-1 > a').click(function() {
        $('#tab-container-1 div#'+$(this).attr('id')).fadeToggle('slow','swing');
        return false;
    });
});
function debug(txt) {
    if (console) console.log(txt);
}
function HookTooltips() {
    setTimeout(function() {
        $('.tipsy').remove();
        $('a[title]', Content).tipsy({gravity: $.fn.tipsy.autoNS});
        $('.remove-mac[title], .add-mac[title], .icon-help[title]', Content).tipsy({gravity: $.fn.tipsy.autoNS});
        $('.task-name[title], .icon[title], .icon-ping[title], .icon-ping-down[title], .icon-ping-up[title]', Content).tipsy({gravity: $.fn.tipsy.autoNS});
        $('img[title]', Content).tipsy({gravity: $.fn.tipsy.autoNS});
    }, 400);
}
function duplicateImageName() {
    if (document.getElementById('iName') != null && document.getElementById('iFile')) {
        if (document.getElementById('iFile').value == null || document.getElementById('iFile').value.length == 0) {
            var str = document.getElementById('iName').value;
            var strOut = "";
            for(var i = 0;i < str.length;i++) {
                var c = str[i];
                var code = c.charCodeAt(0);
                if ((code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) || (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)) || (code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0))) strOut += c;
            }
            document.getElementById('iFile').value=strOut;
        }
    }
}
function DeployStuff() {
    $('#isDebugTask').click(function() {
        if ($(this).is(':checked')) {
            $('#scheduleInstant').checked = true;
            $('.hideFromDebug').slideUp('fast');
        } else {
            $('.hideFromDebug').slideDown('fast');
            $('.hidden').hide();
        }
    });
    // Bind radio buttons for 'Single' and 'Cron' scheduled task
    $('input[name="scheduleType"]').click(function() {
        var $content = $(this).parents('p').parent().find('p').eq($(this).parent().index());
        if ($(this).is(':checked') && !$('#isDebugTask').is(':checked')) {
            $content.slideDown('fast').siblings('.hidden').slideUp('fast');
        } else if (!$('#isDebugTask').is(':checked')) {
            $content.slideDown('fast');
            $('.calendar').remove();
            $('.error').removeClass('error');
        }
    });
    // Basic validation on deployment page
    $('form#deploy-container').submit(function() {
        var result = true;
        var scheduleType = $('input[name="scheduleType"]:checked', $(this)).val();
        var inputsToValidate = $('#' + scheduleType + 'Options > input').removeClass('error');
        if (scheduleType == 'cron') {
            inputsToValidate.each(function() {
                var $min = $('#scheduleCronMin');
                var $hour = $('#scheduleCronHour');
                var $dom = $('#scheduleCronDOM');
                var $month = $('#scheduleCronMonth');
                var $dow = $('#scheduleCronDOW');
                // Basic checks
                if (!checkMinutesField($min.val())) {
                    result = false;
                    $min.addClass('error');
                }
                if (!checkHoursField($hour.val())) {
                    result = false;
                    $hour.addClass('error');
                }
                if (!checkDOMField($dom.val())) {
                    result = false;
                    $dom.addClass('error');
                }
                if (!checkMonthField($month.val())) {
                    result = false;
                    $month.addClass('error');
                }
                if (!checkDOWField($dow.val())) {
                    result = false;
                    $dow.addClass('error');
                }
            });
        } else if (scheduleType == 'single') {
            // Format check
            if (!inputsToValidate.val().match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/)) {
                result = false;
                inputsToValidate.addClass('error').click();
            }
        }
        return result;
    });
    // Auto open the calendar when chosen
    $('#scheduleSingle').click(function() {
        if ($(this).is(':checked')) {
            $('#scheduleSingleTime').focus();
        }
    });
}
function checkField(field, min, max) {
    // Trim the values to ensure we have valid data.
    field = field.trim();
    // If the format is not in # or * or */# or #-#/# fail.
    if (field === '' || field === undefined || field === null || !field.match(/^((\*(\/[0-9]+)?)|[0-9\-\,\/]+)/)) {
        return false;
    }
    // Split the field on commas.
    var v = field.split(',');
    // Loop through all of them.
    $.each(v,function(key,vv) {
        // Split the values on slash
        vvv = vv.split('/');
        // Set the step pattern
        step = (vvv[1] === '' || vvv[1] === undefined || vvv[1] === null ? 1 : vvv[1]);
        // Split the values on dash
        vvvv = vvv[0].split('-');
        // Set the new min and max values.
        _min = vvvv.length == 2 ? vvvv[0] : (vvv[0] == '*' ? min : vvv[0]);
        _max = vvvv.length == 2 ? vvvv[1] : (vvv[0] == '*' ? max : vvv[0]);
        result = true;
        if (!checkIntValue(step,min,max,true)) {
            result = false;
        } else if (!checkIntValue(_min,min,max,true)) {
            result = false;
        } else if (!checkIntValue(_max,min,max,true)) {
            result = false;
        }
    });
    return result;
}
function checkIntValue(value,min,max,extremity) {
    var val = parseInt(value,10);
    if (value == val) {
        if (extremity) {
            if (val < min || val > max) {
                return false;
            }
        }
        return true;
    }
}
function checkMinutesField(minutes) {
    return checkField(minutes,0,59);
}
function checkHoursField(hours) {
    return checkField(hours,0,23);
}
function checkDOMField(DOM) {
    return checkField(DOM,1,31);
}
function checkMonthField(month) {
    return checkField(month,1,12);
}
function checkDOWField(DOW) {
    return checkField(DOW,0,6);
}
function checkboxToggleSearchListPages() {
    // Checkbox toggle
    $('.toggle-checkboxAction').click(function() {
        $('input.toggle-action[type="checkbox"]')
            .not(':hidden')
            .prop('checked',$(this).is(':checked'));
    });
}
function ProductUpdate() {
    if (typeof($('#productKey').val()) == 'undefined') return;
    $('#productKey').val($('#productKey').val().replace(/[^A-Za-z0-9]/g,'').replace(/([\w+]{5})/g,'$1-').substring(0,29));
    $('#productKey').on('change keyup',function(e) {
        var start = this.selectionStart,
            end = this.selectionEnd;
        $(this).val($(this).val().replace(/[^A-Za-z0-9]/g,'').toUpperCase());
        $(this).val($(this).val().substring(0,25));
        this.setSelectionRange(start,end);
        e.preventDefault();
    }).focus(function(e) {
        var start = this.selectionStart,
            end = this.selectionEnd;
        $(this).val($(this).val().replace(/[^A-Za-z0=9]/g,'').toUpperCase());
        $(this).val($(this).val().substring(0,25));
        this.setSelectionRange(start,end);
        e.preventDefault();
    }).blur(function(e) {
        $(this).val($(this).val().replace(/([\w+]{5})/g,'$1-'));
        $(this).val($(this).val().substring(0,29));
        e.preventDefault();
    });
}
