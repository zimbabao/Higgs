/*****************************************************************************
*
*                      Higgs JavaScript Virtual Machine
*
*  This file is part of the Higgs project. The project is distributed at:
*  https://github.com/maximecb/Higgs
*
*  Copyright (c) 2012, Maxime Chevalier-Boisvert. All rights reserved.
*
*  This software is licensed under the following license (Modified BSD
*  License):
*
*  Redistribution and use in source and binary forms, with or without
*  modification, are permitted provided that the following conditions are
*  met:
*   1. Redistributions of source code must retain the above copyright
*      notice, this list of conditions and the following disclaimer.
*   2. Redistributions in binary form must reproduce the above copyright
*      notice, this list of conditions and the following disclaimer in the
*      documentation and/or other materials provided with the distribution.
*   3. The name of the author may not be used to endorse or promote
*      products derived from this software without specific prior written
*      permission.
*
*  THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED
*  WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
*  MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
*  NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
*  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
*  NOT LIMITED TO PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
*  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
*  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
*  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
*  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*****************************************************************************/

/**
Perform an assertion test
*/
function assert(test, error)
{
    // TODO
}

/**
Print a value to the console
*/
function print(val)
{
    // TODO

    // Convert the value to a string
    //var strVal = boxToString(val);
       
    // Print the string
    //puts(strVal);
}

/**
Concatenate the strings from two string objects
*/
function $rt_strcat(str1, str2)
{
    // TODO

    /*
    // Get the length of both strings
    var len1 = iir.icast(IRType.pint, get_str_size(str1));
    var len2 = iir.icast(IRType.pint, get_str_size(str2));

    // Compute the length of the new string
    var newLen = len1 + len2;

    // Allocate a string object
    var newStr = alloc_str(newLen);

    // Copy the character data from the first string
    for (var i = pint(0); i < len1; i++)
    {
        var ch = get_str_data(str1, i);
        set_str_data(newStr, i, ch);
    }

    // Copy the character data from the second string
    for (var i = pint(0); i < len2; i++)
    {
        var ch = get_str_data(str2, i);
        set_str_data(newStr, len1 + i, ch);
    }

    // Compute the hash code for the new string
    compStrHash(newStr);

    // Find/add the concatenated string in the string table
    var newStr = getTableStr(newStr);

    return newStr;
    */
}

/**
Create a string representing an integer value
*/
function $rt_intToStr(intVal, radix)
{
    assert (
        radix > 0 && radix <= 36,
        'invalid radix'
    );

    var strLen;
    var neg;

    // If the integer is negative, adjust the string length for the minus sign
    if (intVal < pint(0))
    {
        strLen = 1;
        intVal *= -1;
        neg = true;
    }
    else
    {
        strLen = 0;
        neg = false;
    }

    // Compute the number of digits to add to the string length
    var intVal2 = intVal;
    do
    {
        strLen++;
        intVal2 /= radix;

    } while (intVal2 !== 0);

    /*
    // TODO: alloc_str
    // Allocate a string object
    var strObj = alloc_str(strLen);

    // If the string is negative, write the minus sign
    if (neg)
    {
        set_str_data(strObj, pint(0), u16(45));
    }

    var digits = '0123456789abcdefghijklmnopqrstuvwxyz';

    // Write the digits in the string
    var i = strLen - pint(1);
    do
    {
        var digit = intVal % radix;

        var ch = get_str_data(digits, digit);

        set_str_data(strObj, i, ch);

        intVal /= radix; 

        i--;

    } while (intVal !== pint(0));

    // Compute the hash code for the new string
    compStrHash(strObj);

    // Return the string object
    return strObj;
    */

    // TODO: get table string
}

/**
Get the string representation of a value
*/
function $rt_toString(v)
{
    var type = typeof v;

    if (type === "undefined")
        return "undefined";

    if (type === "boolean")
        return v? "true":"false";

    if (type === "string")
        return v;

    if (type === "number")
        return "number value, TODO!";

    if (type === "object")
        return v? v.toString():"null";

    if (type === "function" || type === "array")
        return v.toString();

    return "unhandled type in toString";
}

/**
JS typeof operator
*/
function $rt_typeof(v)
{
    if ($ir_is_int(v) || $ir_is_float(v))
        return "number";

    if ($ir_is_string(v) === true)
        return "string";

    if ($ir_is_const(v) === true)
    {
        if (v === true  || v === false)
            return "boolean";

        if (v === undefined)
            return "undefined";
    }

    if ($ir_is_refptr(v) === true)
    {
        var type = $rt_obj_get_header(v);

        if (type === $rt_LAYOUT_OBJ || type === $rt_LAYOUT_ARR)
            return "object";

        if (type === $rt_LAYOUT_CLOS)
            return "function";
    }

    return "unhandled type in typeof";
}

/**
JS addition operator
*/
function $rt_add(x, y)
{
    // If both values are integer
    if ($ir_is_int(x) && $ir_is_int(y))
    {
        var r;
        if (r = $ir_add_i32_ovf(x, y))
        {
            return r;
        }
        else
        {
            var fx = $ir_i32_to_f64(x);
            var fy = $ir_i32_to_f64(y);
            return $ir_add_f64(fx, fy);
        }
    }

    // If either value is floating-point or integer
    else if (
        ($ir_is_float(x) || $ir_is_int(x)) &&
        ($ir_is_float(y) || $ir_is_int(y)))
    {
        var fx = $ir_is_float(x)? x:$ir_i32_to_f64(x);
        var fy = $ir_is_float(y)? y:$ir_i32_to_f64(y);

        return $ir_add_f64(fx, fy);
    }

    // Evaluate the string value of both arguments
    var sx = $rt_toString(x);
    var sy = $rt_toString(y);


    // TODO: need $rt_strcat



    /*
    auto l0 = str_get_len(s0);
    auto l1 = str_get_len(s1);

    auto sO = str_alloc(interp, l0+l1);

    for (size_t i = 0; i < l0; ++i)
        str_set_data(sO, i, str_get_data(s0, i));
    for (size_t i = 0; i < l1; ++i)
        str_set_data(sO, l0+i, str_get_data(s1, i));

    compStrHash(sO);
    sO = getTableStr(interp, sO);

    interp.setSlot(
        instr.outSlot, 
        Word.ptrv(sO),
        Type.STRING
    );
    */
}

/**
JS subtraction operator
*/
function $rt_sub(x, y)
{
    // TODO




}

