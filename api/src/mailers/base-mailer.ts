import { join } from "path"
import { readFileSync } from "fs"

import { isEmpty, template } from "lodash"
import mjml2html from "mjml"
import nodemailer from "nodemailer"

import {
  APPLICATION_NAME,
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_SERVICE,
  MAIL_USER,
} from "@/config"
import logger from "@/utils/logger"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HasNoArgsConstructor<T> = T extends { new (): any } ? true : false
type CleanConstructorParameters<T extends typeof BaseMailer> = HasNoArgsConstructor<T> extends true
  ? []
  : ConstructorParameters<T>

export type MailerOptions = {
  mailFrom?: string
  mailHost?: string
  mailPort?: number
}

export type SendMailOptions = {
  to: string
  subject: string
  html: string
  text?: string
}

const authConfigOptions =
  !isEmpty(MAIL_USER) && !isEmpty(MAIL_PASS)
    ? {
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS,
        },
      }
    : {}
export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  // MailDev is a fake service type that means use the local maildev server
  service: MAIL_SERVICE == "MailDev" ? undefined : MAIL_SERVICE,
  secure: MAIL_PORT === 465 || MAIL_PORT === 587,
  ...authConfigOptions,
  connectionTimeout: 5000,
  ignoreTLS: false,
  tls: { rejectUnauthorized: false },
  pool: true,
})

export const VUESQUE_TEMPLATE_DELIMINATOR_REGEX = /{{([\s\S]+?)}}/g

export class BaseMailer {
  protected mailOptions: {
    from: string
  } = {
    from: MAIL_FROM,
  }
  protected filename: string

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    this.filename = args[0] || __filename
  }

  static perform<T extends typeof BaseMailer>(
    this: T,
    ...args: CleanConstructorParameters<T>
  ): ReturnType<InstanceType<T>["perform"]> {
    const instance = new this(...args)
    return instance.perform()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perform(): any {
    throw new Error("Not Implemented")
  }

  // TODO: instead of catching any errors here, we should push emails to a queue
  // and handle the failure in the queue consumer
  async sendMail({ to, subject, html, text }: SendMailOptions) {
    return transporter
      .sendMail({
        to,
        from: `${APPLICATION_NAME} <${this.mailOptions.from}>`,
        subject,
        html,
        text: text || html,
      })
      .catch((error) => {
        logger.error(`Failed to send mail: ${error}`, {
          message: new Error().stack,
        })
      })
  }

  renderHtml(name: string, data?: object | undefined) {
    return this.render(`${name}.html`, data)
  }

  renderText(name: string, data?: object | undefined) {
    return this.render(`${name}.txt`, data)
  }

  get templateName(): string {
    //const match = this.filename.match(/\/mailers\/(.*)\.(ts|js)$/)
    const match = this.filename.match(/[\\/]mailers[\\/].*\.(ts|js)$/)

    if (match) return match[0].replace(/.(ts|js)$/g, "").replace(/[\\/]mailers/, "")

    throw new Error(`Could not determine template name from filename: ${this.filename}`)
  }

  /**
   * TODO: add EJS or Pug for rendering
   *
   * Default lodash template delimiters:
   * - escape: /<%-([\s\S]+?)%>/g
   * - evaluate: /<%([\s\S]+?)%>/g
   * - interpolate: /<%=([\s\S]+?)%>/g - We are using Vue delimiters `{{ }}`
   */
  private render(name: string, data?: object | undefined) {
    const templatePath = this.templatePath(name)
    const templateString = readFileSync(templatePath, "utf8")
    const compiledTemplate = template(templateString, {
      interpolate: VUESQUE_TEMPLATE_DELIMINATOR_REGEX,
    })
    const body = compiledTemplate(data)

    if (body.startsWith("<mjml>")) {
      const { html, errors } = mjml2html(body)
      if (errors.length) {
        throw new Error(`MJML errors, ${JSON.stringify(errors, null, 2)}`)
      }

      return html
    }

    return body
  }

  private templatePath(path: string) {
    return join(__dirname, `../templates`, path)
  }
}

export default BaseMailer
