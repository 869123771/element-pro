import {home_en_us} from './modules/home'
import {common_en_us} from './modules/common'
import {system_user_en_us} from './modules/system/user'
import {system_dict_en_us} from './modules/system/dict'
import {system_dict_category_en_us} from './modules/system/dict_category'
import {system_role_en_us} from './modules/system/role'

export default {
    ...home_en_us,
    ...common_en_us,
    ...system_user_en_us,
    ...system_dict_en_us,
    ...system_dict_category_en_us,
    ...system_role_en_us
}
