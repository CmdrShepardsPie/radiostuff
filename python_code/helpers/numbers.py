def pow_and_fix(f_value, decimals, offset=1):
    s_value = str(f_value)
    precision = len(s_value) - (s_value.find('.') + 1)
    new_value = round(round(f_value * pow(10, precision)) * pow(10, decimals - precision), offset)
    return new_value
