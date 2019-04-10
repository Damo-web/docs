# Webpack优化

> 本篇目着重于 Webpack 速度及性能优化，共分为两大部分。前一部分着重于 webpack V2版本相关性能及构建用时优化，后一部分着重于 webpack V4版本相关性能及构建用时优化。

## 起因

  中后台应用中因npm包体量重、模块众多、组件颗粒度细腻，导致开发时遇到两大突出问题：

  - 热更新速度缓慢，长达10s左右

  - 构建用时过长，长达180s左右

## 热更新

  在 Webpack v2版本中，当项目模块（ chunks ）众多时，热更新耗时主要用于 Webpack 内置插件 RemoveParentModulesPlugin 。

  具体详情可参阅：[RemoveParentModulesPlugin takes a long time with hundreds of chunks](https://github.com/webpack/webpack/issues/6248)

  阅读上述 issue ，可知 RemoveParentModulesPlugin 在 Webpack V2版本中会存在性能问题，在进一步查阅 Webpack 2.7 版本源码后，更加确认了此问题的存在。相关源码如下：

  ```javascript
  class RemoveParentModulesPlugin {
    apply(compiler) {
      compiler.plugin("compilation", (compilation) => {
        compilation.plugin(["optimize-chunks-basic", "optimize-extracted-chunks-basic"], (chunks) => {
          for(var index = 0; index < chunks.length; index++) {
            var chunk = chunks[index];
            if(chunk.parents.length === 0) continue;

            // TODO consider Map when performance has improved https://gist.github.com/sokra/b36098368da7b8f6792fd7c85fca6311
            var cache = Object.create(null);
            var modules = chunk.modules.slice();
            for(var i = 0; i < modules.length; i++) {
              var module = modules[i];

              var dId = debugIds(module.chunks);
              var parentChunksWithModule;
              if((dId in cache) && dId !== "no") {
                parentChunksWithModule = cache[dId];
              } else {
                parentChunksWithModule = cache[dId] = allHaveModule(chunk.parents, module);
              }
              if(parentChunksWithModule) {
                module.rewriteChunkInReasons(chunk, parentChunksWithModule);
                chunk.removeModule(module);
              }
            }
          }
        });
      });
    }
  }
  
  ```
  因项目迁移至 Webpack V4版本，成本巨大，具有风险，只能在 Webpack V2版本进行打补丁式处理。

  而在开发模式下，其实并不需要 RemoveParentModulesPlugin 提供的优化，故可以使用自定义插件来避免此次优化。相关代码如下：


  ```javascript
  
  class OptimizeChunkTraversePlugin{
    apply(compiler) {
      // apply the plugin in webpack < 4 
      // webpack4+ fixed this performance bug
      // Reference: https://github.com/webpack/webpack/issues/6248
      if (!compiler.hooks) {
        compiler.plugin('compilation', compilation => {
          // optimize webpack built-in plugin : RemoveParentModulesPlugin
          compilation.plugin(['optimize-chunks-basic', 'optimize-extracted-chunks-basic'], chunks => {
            chunks.forEach(chunk => {
              chunk.parents = [];
            })
          })
        })
      }
    }
  }
  
  ```
  
  通过此次优化，热更新耗时从 10s 下降至 2s，避免了之前开发过程中漫长等待。

## 构建时






