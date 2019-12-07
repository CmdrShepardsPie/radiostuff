def pow_and_fix(f_value, decimals, offset=1):
    s_value = str(f_value)
    precision = len(s_value) - (s_value.find('.') + 1)
    stage_a = round(f_value * pow(10, precision))
    stage_b = pow(10, decimals - precision)
    stage_c = (stage_a * stage_b)
    result = round(stage_c, offset)
    print('f_value', f_value, 'decimals', decimals, 'offset', offset,
          's_value', s_value, 'precision', precision,
          'stage_a', stage_a, 'stage_b', stage_b, 'stage_c', stage_c,
          'result', result)
    return result
