import { nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import installStyle from '@element-plus/test-utils/style-plugin'
import Checkbox from '@element-plus/components/checkbox/src/checkbox.vue'
import CheckboxGroup from '@element-plus/components/checkbox/src/checkbox-group.vue'
import Input from '@element-plus/components/input'
import Form from '../src/form.vue'
import FormItem from '../src/form-item.vue'

import type { VueWrapper } from '@vue/test-utils'
import type { FormInstance } from '../src/form'
import type { FormRules } from '../src/types'
import type { FormItemInstance } from '../src/form-item'

const findStyle = (wrapper: VueWrapper<any>, selector: string) =>
  wrapper.find<HTMLElement>(selector).element.style

;(globalThis as any).ASYNC_VALIDATOR_NO_WARNING = 1

describe('Form', () => {
  beforeAll(() => {
    installStyle()
  })

  test('label width', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
        })
        return () => (
          <Form ref="form" model={form} labelWidth="80px">
            <FormItem label="Activity Name">
              <Input v-model={form.name} />
            </FormItem>
          </Form>
        )
      },
    })
    expect(findStyle(wrapper, '.el-form-item__label').width).toBe('80px')
  })

  test('auto label width', async () => {
    const labelPosition = ref('right')
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          intro: '',
        })
        return () => (
          <Form
            ref="form"
            model={form}
            labelWidth="auto"
            labelPosition={labelPosition.value}
          >
            <FormItem label="Name">
              <Input v-model={form.name} />
            </FormItem>
            <FormItem label="Intro">
              <Input v-model={form.intro} />
            </FormItem>
          </Form>
        )
      },
    })

    await nextTick()

    const formItems = wrapper.findAll<HTMLElement>('.el-form-item__content')
    const marginLeft = parseInt(formItems[0].element.style.marginLeft, 10)
    const marginLeft1 = parseInt(formItems[1].element.style.marginLeft, 10)
    expect(marginLeft).toEqual(marginLeft1)

    labelPosition.value = 'left'
    await nextTick()

    const formItems1 = wrapper.findAll<HTMLElement>('.el-form-item__content')
    const marginRight = parseInt(formItems1[0].element.style.marginRight, 10)
    const marginRight1 = parseInt(formItems1[1].element.style.marginRight, 10)
    expect(marginRight).toEqual(marginRight1)
  })

  test('form-item auto label width', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          region: '',
          type: '',
        })
        return () => (
          <Form
            ref="form"
            labelPosition="right"
            labelWidth="150px"
            model={form}
          >
            <FormItem label="名称">
              <Input v-model={form.name} />
            </FormItem>
            <FormItem label="活动区域" label-width="auto">
              <Input v-model={form.region} />
            </FormItem>
            <FormItem
              label="活动形式(我是一个很长很长很长很长的label)"
              label-width="auto"
            >
              <Input v-model={form.type} />
            </FormItem>
          </Form>
        )
      },
    })

    await nextTick()

    const formItemLabels = wrapper.findAll<HTMLElement>('.el-form-item__label')
    const formItemLabelWraps = wrapper.findAll<HTMLElement>(
      '.el-form-item__label-wrap'
    )

    const labelWrapMarginLeft1 = formItemLabelWraps[0].element.style.marginLeft
    const labelWrapMarginLeft2 = formItemLabelWraps[1].element.style.marginLeft
    expect(labelWrapMarginLeft1).toEqual(labelWrapMarginLeft2)
    expect(labelWrapMarginLeft2).toEqual('')

    const labelWidth0 = parseInt(formItemLabels[0].element.style.width, 10)
    expect(labelWidth0).toEqual(150)
    const labelWidth1 = formItemLabels[1].element.style.width
    const labelWidth2 = formItemLabels[2].element.style.width
    expect(labelWidth1).toEqual(labelWidth2)
    expect(labelWidth2).toEqual('auto')
  })

  test('inline form', () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          address: '',
        })
        return () => (
          <Form ref="form" model={form} inline>
            <FormItem>
              <Input v-model={form.name} />
            </FormItem>
            <FormItem>
              <Input v-model={form.address} />
            </FormItem>
          </Form>
        )
      },
    })
    expect(wrapper.classes()).toContain('el-form--inline')
  })

  test('label position', () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          address: '',
        })
        return () => (
          <div>
            <Form model={form} labelPosition="top" ref="labelTop">
              <FormItem>
                <Input v-model={form.name} />
              </FormItem>
              <FormItem>
                <Input v-model={form.address} />
              </FormItem>
            </Form>
            <Form model={form} labelPosition="left" ref="labelLeft">
              <FormItem>
                <Input v-model={form.name} />
              </FormItem>
              <FormItem>
                <Input v-model={form.address} />
              </FormItem>
            </Form>
          </div>
        )
      },
    })
    expect(wrapper.findComponent({ ref: 'labelTop' }).classes()).toContain(
      'el-form--label-top'
    )
    expect(wrapper.findComponent({ ref: 'labelLeft' }).classes()).toContain(
      'el-form--label-left'
    )
  })

  test('label size', () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
        })
        return () => (
          <div>
            <div>
              <Form model={form} size="small" ref="labelSmall">
                <FormItem>
                  <Input v-model={form.name} />
                </FormItem>
              </Form>
            </div>
          </div>
        )
      },
    })
    expect(wrapper.findComponent(FormItem).classes()).toContain(
      'el-form-item--small'
    )
  })

  test('show message', (done) => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
        })
        return () => (
          <Form model={form} ref="form">
            <FormItem
              label="Name"
              prop="name"
              showMessage={false}
              rules={{
                required: true,
                message: 'Please input name',
                trigger: 'change',
                min: 3,
                max: 6,
              }}
            >
              <Input v-model={form.name} />
            </FormItem>
          </Form>
        )
      },
    })
    const form = wrapper.findComponent(Form).vm as FormInstance
    form.validate(async (valid) => {
      expect(valid).toBe(false)
      await nextTick()
      expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
      done()
    })
  })

  test('reset field', async () => {
    const form = reactive({
      name: '',
      address: '',
      type: Array<string>(),
    })

    const wrapper = mount({
      setup() {
        const rules: FormRules = {
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' },
          ],
          address: [
            {
              required: true,
              message: 'Please input address',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: 'Please input type',
              trigger: 'change',
            },
          ],
        }
        return () => (
          <Form ref="form" model={form} rules={rules}>
            <FormItem label="name" prop="name">
              <Input v-model={form.name} ref="fieldName" />
            </FormItem>
            <FormItem label="address" prop="address">
              <Input v-model={form.address} ref="fieldAddr" />
            </FormItem>
            <FormItem label="type" prop="type">
              <CheckboxGroup v-model={form.type}>
                <Checkbox label="type1" name="type" />
                <Checkbox label="type2" name="type" />
                <Checkbox label="type3" name="type" />
                <Checkbox label="type4" name="type" />
              </CheckboxGroup>
            </FormItem>
          </Form>
        )
      },
    })

    form.name = 'jack'
    form.address = 'aaaa'
    form.type.push('type1')

    const formRef = wrapper.findComponent({ ref: 'form' }).vm as FormInstance
    formRef.resetFields()
    await nextTick()
    expect(form.name).toBe('')
    expect(form.address).toBe('')
    expect(form.type.length).toBe(0)
  })

  test('clear validate', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          address: '',
          type: [],
        })

        const rules: FormRules = reactive({
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' },
          ],
          address: [
            {
              required: true,
              message: 'Please input address',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: 'Please input type',
              trigger: 'change',
            },
          ],
        })

        return () => (
          <Form ref="form" model={form} rules={rules}>
            <FormItem label="name" prop="name" ref="name">
              <Input v-model={form.name} />
            </FormItem>
            <FormItem label="address" prop="address" ref="address">
              <Input v-model={form.address} />
            </FormItem>
            <FormItem label="type" prop="type">
              <CheckboxGroup v-model={form.type}>
                <Checkbox label="type1" name="type" />
                <Checkbox label="type2" name="type" />
                <Checkbox label="type3" name="type" />
                <Checkbox label="type4" name="type" />
              </CheckboxGroup>
            </FormItem>
          </Form>
        )
      },
    })

    const form = wrapper.findComponent({ ref: 'form' }).vm as FormInstance
    const nameField = wrapper.findComponent({ ref: 'name' })
      .vm as FormItemInstance
    const addressField = wrapper.findComponent({ ref: 'address' })
      .vm as FormItemInstance
    await form.validate().catch(() => undefined)
    await nextTick()
    expect(nameField.validateMessage).toBe('Please input name')
    expect(addressField.validateMessage).toBe('Please input address')
    form.clearValidate(['name'])
    await nextTick()
    expect(nameField.validateMessage).toBe('')
    expect(addressField.validateMessage).toBe('Please input address')
    form.clearValidate()
    await nextTick()
    expect(addressField.validateMessage).toBe('')
  })

  test('scroll to field', () => {
    const wrapper = mount({
      setup() {
        return () => (
          <div>
            <Form ref="form">
              <FormItem prop="name" ref="formItem">
                <Input />
              </FormItem>
            </Form>
          </div>
        )
      },
    })

    const oldScrollIntoView = window.HTMLElement.prototype.scrollIntoView

    const scrollIntoViewMock = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = function () {
      scrollIntoViewMock(this)
    }

    const form = wrapper.findComponent({ ref: 'form' }).vm as FormInstance
    form.scrollToField('name')
    expect(scrollIntoViewMock).toHaveBeenCalledWith(
      wrapper.findComponent({ ref: 'formItem' }).element
    )

    window.HTMLElement.prototype.scrollIntoView = oldScrollIntoView
  })

  test('validate return parameters', async () => {
    const form = reactive({
      name: 'test',
      age: '',
    })

    const wrapper = mount({
      setup() {
        const rules = reactive({
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' },
          ],
          age: [
            { required: true, message: 'Please input age', trigger: 'blur' },
          ],
        })
        return () => (
          <Form
            ref="formRef"
            model={form}
            rules={rules}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            onSubmit="return false"
          >
            <FormItem prop="name" label="name">
              <Input v-model={form.name} />
            </FormItem>
            <FormItem prop="age" label="age">
              <Input v-model={form.age} />
            </FormItem>
          </Form>
        )
      },
    })
    const vm = wrapper.vm

    function validate() {
      return (vm.$refs.formRef as FormInstance)
        .validate()
        .then(() => ({ valid: true, fields: undefined }))
        .catch((fields) => ({ valid: false, fields }))
    }

    let res = await validate()
    expect(res.valid).toBe(false)
    expect(Object.keys(res.fields).length).toBe(1)
    form.name = ''
    await nextTick()

    res = await validate()
    expect(res.valid).toBe(false)
    expect(Object.keys(res.fields).length).toBe(2)

    form.name = 'test'
    form.age = 'age'
    await nextTick()
    res = await validate()
    expect(res.valid).toBe(true)
    expect(res.fields).toBe(undefined)
  })
})
